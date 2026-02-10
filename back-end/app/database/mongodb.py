"""
MongoDB connection file
----------------------
Handles database connection for crop details storage
SYNC PyMongo version
"""

from pymongo import MongoClient

try:
    client = MongoClient(
        "mongodb://localhost:27017",
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


# =========================================
# Collections (exported globally)
# =========================================
crop_collection = db["crop_details"]
users_collection = db["users"]
news_collection = db["news"]
predictions_collection = db["predictions"]
