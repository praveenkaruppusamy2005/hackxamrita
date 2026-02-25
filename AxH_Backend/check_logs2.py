import os
from twilio.rest import Client
import sys

account_sid = ""
auth_token  = ""

client = Client(account_sid, auth_token)

print("Fetching latest call...")
calls = client.calls.list(limit=1)

if not calls:
    print("No recent calls.")
    sys.exit(0)

call = calls[0]
print(f"Call SID: {call.sid}")
print(f"To: {call.to}")
print(f"Status: {call.status}")
print(f"Direction: {call.direction}")

print("\nFetching notifications for this call...")
notifications = client.calls(call.sid).notifications.list(limit=5)
for n in notifications:
    print(f"Error {n.error_code}: {n.message_text}")

