import asyncio
import io
import os
import uuid
import wave
import audioop
from typing import Optional
import requests as req_lib
from flask import Flask, request, Response, send_file, session
from twilio.twiml.voice_response import VoiceResponse
from reverie_sdk import ReverieClient
from reverie_sdk.services.asr import AudioStream
from dotenv import load_dotenv

import db
import ai_router

load_dotenv()

app = Flask(__name__)
app.secret_key = "super_secret_banking_key" # Required for Twilio session caching

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN  = os.environ.get("TWILIO_AUTH_TOKEN", "")
REVERIE_API_KEY    = os.environ.get("REVERIE_API_KEY", "")
REVERIE_APP_ID     = os.environ.get("REVERIE_APP_ID", "")
REVERIE_TTS_URL    = "https://revapi.reverieinc.com/"

reverie_client = ReverieClient(api_key=REVERIE_API_KEY, app_id=REVERIE_APP_ID)

# Temp folder for TTS audio files
TTS_DIR = os.path.join(os.path.dirname(__file__), "tts_cache")
os.makedirs(TTS_DIR, exist_ok=True)

LANG_MAP = {
    "1": ("en", "English"),
    "2": ("hi", "Hindi"),
    "3": ("ta", "Tamil"),
    "4": ("te", "Telugu"),
}

SPEAKER_MAP = {
    "en": "en_female",
    "hi": "hi_female",
    "ta": "ta_female",
    "te": "te_female",
}

MESSAGES = {
    "en": {
        "speak_prompt": "Please speak after the beep.",
        "processing":   "Got it. Processing now.",
        "you_said":     "You said:",
        "unclear":      "Sorry, I could not understand. Please try again.",
        "error":        "Something went wrong. Please try again.",
        "no_audio":     "No audio received. Please try again.",
    },
    "hi": {
        "speak_prompt": "कृपया बीप के बाद बोलें।",
        "processing":   "समझ गया। प्रोसेस हो रहा है।",
        "you_said":     "आपने कहा:",
        "unclear":      "माफ़ करें, समझ नहीं आया। कृपया फिर से बोलें।",
        "error":        "कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें।",
        "no_audio":     "कोई ऑडियो नहीं मिला। कृपया फिर से बोलें।",
    },
    "ta": {
        "speak_prompt": "பீப் ஒலிக்கும் பின் பேசுங்கள்.",
        "processing":   "சரி. செயலாக்கம் நடக்கிறது.",
        "you_said":     "நீங்கள் சொன்னது:",
        "unclear":      "மன்னிக்கவும், புரியவில்லை. மீண்டும் பேசுங்கள்.",
        "error":        "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
        "no_audio":     "ஆடியோ கிடைக்கவில்லை. மீண்டும் பேசுங்கள்.",
    },
    "te": {
        "speak_prompt": "బీప్ తర్వాత మాట్లాడండి.",
        "processing":   "అర్థమైంది. ప్రాసెస్ అవుతోంది.",
        "you_said":     "మీరు చెప్పారు:",
        "unclear":      "క్షమించండి, అర్థం కాలేదు. మళ్ళీ మాట్లాడండి.",
        "error":        "ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.",
        "no_audio":     "ఆడియో అందలేదు. మళ్ళీ మాట్లాడండి.",
    },
}

# ── ElevenLabs TTS ─────────────────────────────────────────────────────────────

ELEVENLABS_API_KEY = "cc018607482fb24a747d051c41ccefb4be77c18f99b99fe7126c85bc5112063d"
ELEVENLABS_VOICE_ID = "EXAVITQu4vr4xnSDxMaL" # Bella (multilingual)

def get_ngrok_url():
    """Get the current public ngrok URL."""
    try:
        r = req_lib.get("http://127.0.0.1:4040/api/tunnels", timeout=2)
        return r.json()["tunnels"][0]["public_url"]
    except Exception:
        return None

def elevenlabs_tts(text: str, lang_code: str) -> Optional[str]:
    """Call ElevenLabs TTS API, save the audio, return path to serve it."""
    # Simple caching based on text hash to avoid repeated API calls
    safe_name = str(hash(text)) + f"_{lang_code}_el.mp3"
    filepath = os.path.join(TTS_DIR, safe_name)
    
    if os.path.exists(filepath):
        return safe_name

    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
        }
        resp = req_lib.post(url, json=data, headers=headers, timeout=15)
        if resp.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(resp.content)
            return safe_name
        else:
            print(f"[TTS] ElevenLabs Error {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"[TTS] Exception: {e}")
    return None

def play_tts(response: VoiceResponse, text: str, lang_code: str):
    """Add ElevenLabs TTS audio to the TwiML response, or fallback to <Say>."""
    ngrok = get_ngrok_url()
    filename = elevenlabs_tts(text, lang_code) if ngrok else None
    if ngrok and filename:
        response.play(f"{ngrok}/audio/{filename}")
    else:
        # Fallback to standard Twilio TTS if ElevenLabs fails
        tw_voices = {
            "en": ("Polly.Joanna", "en-US"),
            "hi": ("Polly.Aditi", "hi-IN"),
            "ta": ("Google.ta-IN-Standard-A", "ta-IN"),
            "te": ("Google.te-IN-Standard-A", "te-IN"),
        }
        voice, lang = tw_voices.get(lang_code, ("Polly.Joanna", "en-US"))
        response.say(text, voice=voice, language=lang)

@app.route("/audio/<filename>")
def serve_audio(filename):
    """Serve a TTS audio file."""
    filepath = os.path.join(TTS_DIR, filename)
    return send_file(filepath, mimetype="audio/mpeg")

# ── Route 1: Authentication (Gather PIN) ─────────────────────────────────────

@app.route("/voice", methods=["POST", "GET"])
def voice():
    response = VoiceResponse()
    
    if not db.MONGO_URI:
        response.say("System error. Database not configured. Please contact support.")
        return Response(str(response), mimetype='text/xml')

    gather = response.gather(
        num_digits=1,
        action="/lang_select",
        timeout=10
    )
    gather.say("Welcome to Secure Banking. For English, press 1. For Hindi, press 2. For Tamil, press 3. For Telugu, press 4.")
    response.redirect("/voice")
    return Response(str(response), mimetype='text/xml')

@app.route("/lang_select", methods=["POST", "GET"])
def lang_select():
    digit = request.values.get("Digits", "1")
    lang_info = LANG_MAP.get(digit, ("en", "English"))
    lang_code = lang_info[0]
    session['lang'] = lang_code
    
    response = VoiceResponse()
    gather = response.gather(
        num_digits=4,
        action="/auth",
        timeout=10
    )
    play_tts(gather, "Please enter your four digit PIN on the keypad.", lang_code)
    response.redirect(f"/lang_select?Digits={digit}")
    return Response(str(response), mimetype='text/xml')

# ── Route 2: Handle Auth and Send to Menu ────────────────────────────────────

@app.route("/auth", methods=["POST", "GET"])
def auth():
    pin = request.values.get("Digits", "")
    phone = request.values.get("From", "+15642344613") # Twilio sends this internally.
    lang_code = session.get('lang', 'en')
    
    response = VoiceResponse()
    
    if db.authenticate_user(phone, pin):
        session['authenticated'] = True
        session['phone'] = phone
        play_tts(response, "Authentication successful.", lang_code)
        response.redirect("/menu")
    else:
        play_tts(response, "Incorrect PIN.", lang_code)
        # Give them another chance (redirect back to PIN gather)
        response.redirect("/lang_select?Digits=" + next((k for k, v in LANG_MAP.items() if v[0] == lang_code), "1"))
        
    return Response(str(response), mimetype='text/xml')

# ── Route 3: Main Banking Menu ───────────────────────────────────────────────

@app.route("/menu", methods=["POST", "GET"])
def menu():
    if not session.get('authenticated'):
        response = VoiceResponse()
        response.redirect("/voice")
        return Response(str(response), mimetype='text/xml')

    response = VoiceResponse()
    lang_code = session.get('lang', 'en')
    
    # We use Gather with input="speech" to get real-time transcription from Twilio
    # This completely eliminates the 3-5 second delay of recording, downloading, and translating!
    gather = response.gather(
        input="speech",
        action=f"/process_banking?lang={lang_code}",
        timeout=3,
        speech_timeout="auto",
        language=f"{lang_code}-IN"
    )
    # The TTS prompt plays *while* Twilio is listening, making it ultra-fast
    play_tts(gather, "How can I help you today?", lang_code)

    # If the user doesn't say anything, loop back
    response.redirect("/menu")
    return Response(str(response), mimetype='text/xml')

# ── Route 4: Process Banking Request ─────────────────────────────────────────

@app.route("/process_banking", methods=["POST"])
def process_banking():
    if not session.get('authenticated'):
        response = VoiceResponse()
        response.redirect("/voice")
        return Response(str(response), mimetype='text/xml')

    text = request.values.get("SpeechResult", "").strip()
    lang_code = session.get('lang', 'en')
    phone = session.get("phone")

    response = VoiceResponse()

    if not text:
        play_tts(response, "I didn't hear anything. Goodbye.", lang_code)
        response.hangup()
        return Response(str(response), mimetype='text/xml')

    print(f"[PROCESS] SpeechResult: '{text}'")

    try:
        # === BANKING ROUTING LOGIC ===
        intent_data = ai_router.route_intent(text)
        intent = intent_data.get("intent")
        
        print(f"[ROUTER] Intent detected: {intent}")
        
        if intent == "end_conversation":
            play_tts(response, "Thank you for banking with us. Goodbye!", lang_code)
            response.hangup()
            return Response(str(response), mimetype='text/xml')
            
        elif intent == "check_balance":
            balance = db.get_balance(phone)
            reply = f"Your current balance is {balance} rupees. What else can I do for you?"
            
        elif intent == "transfer_money":
            amount = intent_data.get("amount")
            recipient = intent_data.get("recipient")
            
            if amount and recipient:
                session['transfer_amount'] = amount
                session['transfer_recipient'] = recipient
                # Route to PIN confirmation instead of directly executing!
                gather = response.gather(num_digits=4, action="/execute_transfer", timeout=10)
                play_tts(gather, f"To securely confirm your transfer of {amount} rupees to {recipient}, please enter your four digit PIN on the keypad.", lang_code)
                return Response(str(response), mimetype='text/xml')
            else:
                reply = "I couldn't understand the transfer amount or the recipient. Please try again."
                
        else:
            # Fallback to Gemini for FAQ
            reply = ai_router.generate_faq_response(text)
            
        # Interactive loop: We append the reply inside a Gather so they can immediately reply!
        gather = response.gather(
            input="speech",
            action=f"/process_banking?lang={lang_code}",
            timeout=3,
            speech_timeout="auto",
            language=f"{lang_code}-IN"
        )
        play_tts(gather, reply, lang_code)
        
    except Exception as e:
        print(f"[PROCESS] Error: {e}")
        play_tts(response, "Something went wrong. Please try again.", lang_code)

    # If they are silent for the gather timeout, hang up instead of looping!
    response.hangup()
    return Response(str(response), mimetype='text/xml')

# ── Route 5: Execute Transfer (Secure PIN Check) ─────────────────────────────

@app.route("/execute_transfer", methods=["POST", "GET"])
def execute_transfer():
    pin = request.values.get("Digits", "")
    phone = session.get("phone")
    amount = float(session.get("transfer_amount", 0))
    recipient = session.get("transfer_recipient", "")
    lang_code = session.get('lang', 'en')
    
    response = VoiceResponse()
    
    # Re-verify the PIN for the transaction
    if db.authenticate_user(phone, pin):
        result = db.transfer_funds(phone, recipient, amount)
        reply = result["message"] + " What else can I do for you?"
    else:
        reply = "Incorrect PIN. Transfer cancelled. What else can I do for you?"
        
    # Drop them back into the interactive conversational loop
    gather = response.gather(
        input="speech",
        action=f"/process_banking?lang={lang_code}",
        timeout=3,
        speech_timeout="auto",
        language=f"{lang_code}-IN"
    )
    play_tts(gather, reply, lang_code)
    
    response.hangup()
    return Response(str(response), mimetype='text/xml')

# ── Reverie Async STT ────────────────────────────────────────────────────────

async def _transcribe(pcm_bytes: bytes, lang_code: str) -> str:
    stream  = AudioStream()
    results = []

    last_text = [""]

    def on_result(result):
        # Result is a ReverieAsrResult object, not a plain string
        if result and hasattr(result, 'text') and result.text:
            text_str = str(result.text).strip()
            if text_str:
                last_text[0] = text_str
                print(f"[STT STREAM] {text_str}")
                if getattr(result, 'final', False):
                    results.append(text_str)

    CHUNK = 3200

    async def _feed():
        for i in range(0, len(pcm_bytes), CHUNK):
            await stream.add_chunk_async(pcm_bytes[i: i + CHUNK])
        try:
            await stream.close_async()
        except Exception:
            pass

    await asyncio.gather(
        _feed(),
        reverie_client.asr.stt_stream_async(
            src_lang=lang_code,
            bytes_or_stream=stream,
            callback=on_result,
            continuous="0",
            domain="generic",
            format="16k_int16",
            logging="true",
            punctuate="true",
            silence=3,
            timeout=10,
        )
    )

    if not results and last_text[0]:
        results.append(last_text[0])

    final_transcript = " ".join(results)
    
    # Print the final result to the console explicitly as requested
    print("=" * 50)
    print(f"FINAL TRANSCRIPTION [{lang_code}]: {final_transcript}")
    print("=" * 50)

    return final_transcript

# ── Start ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(port=5000, debug=False)
