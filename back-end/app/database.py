"""
database.py

PURPOSE:
- Handle MongoDB connection
- Create database client
- Reusable across backend
"""

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Read MongoDB URI and DB name
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Create MongoDB client
client = AsyncIOMotorClient(MONGO_URI)

# Access database
database = client[DATABASE_NAME]

def get_database():
    """
    Returns database instance
    Used in routes & services
    """
    return database
