import os
from twilio.rest import Client

account_sid = ""
auth_token  = ""

client = Client(account_sid, auth_token)

print("Fetching recent calls...")
calls = client.calls.list(limit=3)

for record in calls:
    print(f"Call SID: {record.sid}")
    print(f"To: {record.to}")
    print(f"Status: {record.status}")
    print(f"Direction: {record.direction}")
    print("-" * 30)
