import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

model = None
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using flash model for <1s latency
    model = genai.GenerativeModel('gemini-2.5-flash')

def is_ai_ready():
    return model is not None

def route_intent(transcript: str, state: dict = None) -> dict:
    """
    Returns JSON with intent: 'check_balance', 'transfer_money', or 'faq'
    """
    if not is_ai_ready():
        return {"intent": "faq"}
        
    state_str = ""
    if state and state.get("pending_intent"):
        state_str = f"The user is currently in the middle of a {state.get('pending_intent')} flow. They were previously asked for missing information (amount: {state.get('pending_amount')}, recipient: {state.get('pending_recipient')}). Interpret their response in this context."
        
    prompt = f"""
    You are an intent classifier for a voice banking assistant.
    Analyze this transcript: "{transcript}"
    
    Determine the user's intent from these options:
    1. check_balance (e.g., "what is my balance", "check balance")
    2. transfer_money (e.g., "transfer 500 to Ramesh", "send 1000 rupees to John", or just "500" or "John" if in context)
    3. end_conversation (e.g., "goodbye", "bye", "thanks that is all", "no", "end call")
    4. faq (e.g., "how to improve savings", "what is an EMI", or unclear)
    
    {state_str}
    
    Respond ONLY in strictly valid JSON format, with no markdown formatting:
    {{
        "intent": "check_balance" | "transfer_money" | "end_conversation" | "faq",
        "amount": <number if transfer, else null>,
        "recipient": "<name if transfer, else null>"
    }}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"[AI] Routing error: {e}")
        return {"intent": "faq"}

def generate_faq_response(transcript: str) -> str:
    """
    Generates a fallback conversational response for FAQs.
    """
    if not is_ai_ready():
        return "I'm sorry, my AI processing is currently offline. Please contact support."
        
    prompt = f"""
    You are a polite, helpful financial support assistant.
    Keep your answer concise (1 to 2 sentences max) because it will be spoken over the phone.
    You cannot access account data.
    User asked: "{transcript}"
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[AI] FAQ generation error: {e}")
        return "I'm sorry, I cannot process your request right now."
