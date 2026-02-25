import os
import time
from twilio.rest import Client

from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN  = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE_NUMBER = "+917538803489"

# We will call your actual mobile number. Replace with your own phone number.
YOUR_REAL_PHONE_NUMBER = "+919445100067" # Please change this in the script

import requests

def get_ngrok_url():
    try:
        r = requests.get("http://127.0.0.1:4040/api/tunnels", timeout=2)
        return r.json()["tunnels"][0]["public_url"]
    except Exception:
        return None

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

ngrok_url = get_ngrok_url()
if not ngrok_url:
    print("Error: Could not find active ngrok URL. Is ngrok running?")
    exit(1)

webhook_url = f"{ngrok_url}/voice"
print(f"Initiating call from {TWILIO_PHONE_NUMBER} to {YOUR_REAL_PHONE_NUMBER}...")
print(f"Using webhook URL: {webhook_url}")

try:
    # Use the direct URL to ensure the call connects straight to our Flask app
    call = client.calls.create(
        to=YOUR_REAL_PHONE_NUMBER,
        from_=TWILIO_PHONE_NUMBER,
        url=webhook_url
    )
    print(f"Call initiated successfully! SID: {call.sid}")
    print("Wait for your phone to ring. The Flask app will handle the conversation.")
    
    # Monitor call status
    while True:
        current_call = client.calls(call.sid).fetch()
        print(f"[{time.strftime('%H:%M:%S')}] Status: {current_call.status}")
        if current_call.status in ['completed', 'failed', 'busy', 'no-answer', 'canceled']:
            break
        time.sleep(3)

except Exception as e:
    print(f"Failed to initiate call: {e}")
