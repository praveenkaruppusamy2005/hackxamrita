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
    # Update the webhook url slightly to bust the cache
    updated = client.incoming_phone_numbers(number.sid).update(
        voice_url="https://subcarbonaceous-cathi-nondescriptively.ngrok-free.dev/voice?v=2"
    )
    print(f"Updated Webhook to: {updated.voice_url}")
else:
    print("No numbers found.")
