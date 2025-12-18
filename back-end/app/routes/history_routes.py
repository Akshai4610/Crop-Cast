"""
history_routes.py

PURPOSE:
- Handle prediction history APIs
"""

from fastapi import APIRouter, HTTPException
from app.database import get_database
from app.models.history_model import history_document

router = APIRouter(prefix="/history", tags=["History"])

# CREATE HISTORY RECORD
@router.post("/")
async def create_history(data: dict):
    """
    Store prediction history
    """
    db = get_database()
    history = history_document(data)
    await db.history.insert_one(history)
    return {"message": "Prediction history saved"}


# GET USER HISTORY
@router.get("/{user_id}")
async def get_user_history(user_id: str):
    """
    Fetch all prediction history for a user
    """
    db = get_database()

    history_list = []
    cursor = db.history.find({"user_id": user_id}).sort("created_at", -1)

    async for record in cursor:
        record["_id"] = str(record["_id"])
        history_list.append(record)

    if not history_list:
        raise HTTPException(status_code=404, detail="No history found")

    return history_list
