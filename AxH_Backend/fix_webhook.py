"""
Keeps BOTH the Twilio phone number webhook AND all TwiML Apps pointed at our ngrok URL.
Run in background: python fix_webhook.py
"""
import time
import requests
from twilio.rest import Client

ACCOUNT_SID = ""
AUTH_TOKEN  = ""

def get_ngrok_url():
    try:
        r = requests.get("http://127.0.0.1:4040/api/tunnels", timeout=2)
        return r.json()["tunnels"][0]["public_url"]
    except:
        return None

client = Client(ACCOUNT_SID, AUTH_TOKEN)
number = client.incoming_phone_numbers.list(limit=1)[0]
print(f"Watching: {number.phone_number} | Press Ctrl+C to stop\n")

last_ok = False
while True:
    ngrok = get_ngrok_url()
    if ngrok:
        target = f"{ngrok}/voice"
        changed = False

        # Fix phone number webhook
        current = client.incoming_phone_numbers(number.sid).fetch().voice_url
        if current != target:
            client.incoming_phone_numbers(number.sid).update(voice_url=target, voice_method="POST")
            print(f"[FIXED] Phone number webhook: {target}")
            changed = True

        # Fix all TwiML Apps
        for app in client.applications.list():
            app_data = client.applications(app.sid).fetch()
            if app_data.voice_url != target:
                client.applications(app.sid).update(voice_url=target, voice_method="POST")
                print(f"[FIXED] TwiML App [{app.friendly_name}] -> {target}")
                changed = True

        if not changed and not last_ok:
            print(f"[OK] All webhooks correct: {target}")
            last_ok = True
        elif changed:
            last_ok = False
    else:
        print("[WARN] ngrok not reachable")
        last_ok = False
    time.sleep(10)
