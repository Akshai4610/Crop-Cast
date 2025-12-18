"""
user_model.py

PURPOSE:
- Define MongoDB structure for User
- Used internally for DB operations
"""

from datetime import datetime

def user_document(user: dict) -> dict:
    """
    Converts incoming user data into MongoDB document format
    """
    return {
        "name": user["name"],           # User full name
        "email": user["email"],         # Unique email
        "location": user.get("location", ""),  # Optional
        "created_at": datetime.utcnow(), # Account creation time
        "updated_at": datetime.utcnow(), # Last update time
        "history": []                   # ML prediction history (future)
    }
