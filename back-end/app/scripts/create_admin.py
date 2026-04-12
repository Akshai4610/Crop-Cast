"""
🔐 Create Admin Script (Enterprise Safe)
- Reads credentials from .env
- Creates admin only if not exists
"""

import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from app.database.mongodb import users_collection

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_NAME = os.getenv("ADMIN_NAME", "Super Admin")


def create_admin():
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        print("❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env")
        return

    existing = users_collection.find_one({"email": ADMIN_EMAIL})

    if existing:
        print("⚠️ Admin already exists")
        return

    hashed_password = pwd_context.hash(ADMIN_PASSWORD)

    users_collection.insert_one({
        "fullname": ADMIN_NAME,
        "email": ADMIN_EMAIL,
        "password": hashed_password,
        "role": "admin",
        "blocked": False
    })

    print("✅ Admin created successfully!")


if __name__ == "__main__":
    create_admin()