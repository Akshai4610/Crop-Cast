"""
MongoDB connection file
----------------------
Handles database connection for crop details storage
"""

# Local MongoDB (free, no cloud)
from pymongo import MongoClient

try:
    client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
    client.server_info()  # Raises exception if cannot connect
    print("✅ MongoDB Connected Successfully")
except Exception as e:
    print("❌ MongoDB Connection Failed:", e)

db = client["crop_cast"]

# Collection to store crop information
crop_collection = db["crop_details"]
users_collection = db["users"]  # if you implement user accounts
news_collection = db["news"]   # stores news
predictions_collection = db["predictions"]  # store user predictions
