import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN  = os.environ.get("TWILIO_AUTH_TOKEN", "")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Get the incoming phone number instance
numbers = client.incoming_phone_numbers.list(limit=1)
if numbers:
    number = numbers[0]
    import requests
    try:
        r = requests.get("http://127.0.0.1:4040/api/tunnels", timeout=2)
        ngrok_url = r.json()["tunnels"][0]["public_url"]
    except Exception:
        ngrok_url = "https://subcarbonaceous-cathi-nondescriptively.ngrok-free.dev"
    
    # Update the webhook url slightly to bust the cache
    updated = client.incoming_phone_numbers(number.sid).update(
        voice_url=f"{ngrok_url}/voice?v=3"
    )
    print(f"Updated Webhook to: {updated.voice_url}")
else:
    print("No numbers found.")
