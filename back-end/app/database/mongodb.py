"""
MongoDB connection file
----------------------
Handles database connection for crop details storage
SYNC PyMongo version
"""
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Get values
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

try:
    client = MongoClient(
        MONGO_URL,
        serverSelectionTimeoutMS=5000
    )

    client.server_info()
    print("✅ MongoDB Connected Successfully")

except Exception as e:
    print("❌ MongoDB Connection Failed:", e)


# =========================================
# Database
# =========================================
db = client["crop_cast"]
crop_collection = db["crop_details"]
users_collection = db["users"]
news_collection = db["news"]
predictions_collection = db["predictions"]
activities_collection = db["activities"]  # 🔥 Added for tracking logins/logouts
