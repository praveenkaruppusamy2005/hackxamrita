import os
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI", "")

# Initialize client globally to maintain connection pool
client = None
db = None
users_collection = None

if MONGO_URI:
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client.banking_voice_app
        users_collection = db.users
        # Test connection
        client.admin.command('ping')
        print("[DB] Successfully connected to MongoDB.")
    except Exception as e:
        print(f"[DB] Failed to connect to MongoDB: {e}")

def is_db_connected():
    return users_collection is not None

def authenticate_user(phone: str, pin: str) -> bool:
    if not is_db_connected(): return False
    user = users_collection.find_one({"phone": phone})
    if user and str(user.get("pin")) == str(pin):
        return True
    return False

def get_balance(phone: str) -> float:
    if not is_db_connected(): return 0.0
    user = users_collection.find_one({"phone": phone})
    if user:
        return float(user.get("balance", 0))
    return 0.0

def transfer_funds(from_phone: str, recipient_name: str, amount: float) -> dict:
    if not is_db_connected():
        return {"success": False, "message": "Database not connected."}
        
    user = users_collection.find_one({"phone": from_phone})
    if not user:
        return {"success": False, "message": "Account not found."}
    
    current_balance = float(user.get("balance", 0))
    if current_balance < amount:
        return {"success": False, "message": f"Insufficient balance. You only have {current_balance} rupees."}
    
    # Perform transfer (deduct balance and add log)
    try:
        users_collection.update_one(
            {"phone": from_phone},
            {
                "$inc": {"balance": -amount},
                "$push": {
                    "transactions": {
                        "type": "debit",
                        "amount": amount,
                        "to": recipient_name,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                }
            }
        )
        return {"success": True, "message": f"Successfully transferred {amount} rupees to {recipient_name}."}
    except Exception as e:
        print(f"[DB] Transfer error: {e}")
        return {"success": False, "message": "Transaction failed due to an internal error."}
