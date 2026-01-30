"""
Prediction API
--------------
Stores and fetches prediction history
"""

from fastapi import APIRouter
from datetime import datetime
from app.database.mongodb import prediction_collection

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

@router.post("/save")
def save_prediction(data: dict):
    """
    Save prediction after ML response
    """
    prediction_collection.insert_one({
        "username": data["username"],
        "predicted_crop": data["predicted_crop"],
        "confidence": data["confidence"],
        "probabilities": data.get("probabilities", []),
        "timestamp": datetime.utcnow()
    })
    return {"message": "Prediction saved"}

@router.get("/history/{username}")
def get_history(username: str):
    """
    Fetch prediction history of a user
    """
    return list(
        prediction_collection.find(
            {"username": username},
            {"_id": 0}
        )
    )
