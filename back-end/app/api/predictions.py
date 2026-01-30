"""
Prediction API
==============
Responsibilities:
- Save every prediction made by a user
- Fetch prediction history for a user
"""

from fastapi import APIRouter
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Dict
from app.database.mongodb import predictions_collection

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])


# =======================
# Pydantic Schema
# =======================

class PredictionCreate(BaseModel):
    username: str
    input_data: Dict[str, float]
    predicted_crop: str
    confidence: float


# =======================
# Save Prediction
# =======================

@router.post("/save")
def save_prediction(pred: PredictionCreate):
    """
    Store a prediction record in MongoDB
    """
    predictions_collection.insert_one({
        "username": pred.username,
        "input_data": pred.input_data,
        "predicted_crop": pred.predicted_crop,
        "confidence": pred.confidence,
        "timestamp": datetime.now(timezone.utc)
    })

    return {"message": "Prediction saved successfully"}


# =======================
# Get Prediction History
# =======================

@router.get("/history/{username}")
def get_prediction_history(username: str):
    """
    Fetch all predictions made by a user
    """
    history = list(
        predictions_collection.find(
            {"username": username},
            {"_id": 0}
        )
    )

    return {"history": history}
