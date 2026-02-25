import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI", "")

if not MONGO_URI:
    print("Please set MONGO_URI in .env file.")
    exit(1)

client = MongoClient(MONGO_URI)
db = client.banking_voice_app
users = db.users

# Clear old demo users
users.delete_many({"phone": "+15642344613"})

# Add the test user
demo_user = {
    "phone": "+15642344613",
    "pin": "1234",
    "balance": 12430.0,
    "daily_transfer_limit": 20000.0,
    "transactions": []
}

users.insert_one(demo_user)
print("Successfully initialized test user +15642344613 with PIN 1234 and balance 12430.0.")

# Add Sanjay
sanjay_user = {
    "phone": "+919999999999", # Dummy phone for Sanjay
    "name": "Sanjay",
    "balance": 500.0,
    "transactions": []
}
users.delete_many({"name": "Sanjay"})
users.insert_one(sanjay_user)
print("Successfully initialized recipient user Sanjay.")
