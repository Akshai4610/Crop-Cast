"""
Prediction API
==============
Responsibilities:
✔ Run ML prediction
✔ Save prediction automatically
✔ Return result to frontend
✔ Provide history
"""

from fastapi import APIRouter
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import List

from app.database.mongodb import predictions_collection
from app.services.prediction import predict_crop


# ======================================================
# Router
# Final routes:
# POST   /api/predictions
# GET    /api/predictions/{email}
# ======================================================
router = APIRouter(prefix="/api/predictions", tags=["Predictions"])


# ======================================================
# Request Schema (what frontend must send)
# ======================================================
class PredictionRequest(BaseModel):
    email: str

    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


# ======================================================
# 🔹 Predict + Save
# ======================================================
@router.post("")
def predict_and_save(pred: PredictionRequest):
    """
    Steps:
    1. Call ML model
    2. Save result in MongoDB
    3. Return result
    """

    # Convert request → dict for ML model
    input_data = {
        "N": pred.N,
        "P": pred.P,
        "K": pred.K,
        "temperature": pred.temperature,
        "humidity": pred.humidity,
        "ph": pred.ph,
        "rainfall": pred.rainfall,
    }

    # Run ML prediction
    result = predict_crop(input_data)
    # result = {
    #   predicted_crop,
    #   confidence,
    #   top_3
    # }

    # Save to DB
    predictions_collection.insert_one({
        "email": pred.email,
        "input_data": input_data,
        "predicted_crop": result["predicted_crop"],
        "confidence": result["confidence"],
        "top_3": result["top_3"],
        "timestamp": datetime.now(timezone.utc)
    })

    return result


# ======================================================
# 🔹 Prediction History
# ======================================================
@router.get("/{email}")
def get_prediction_history(email: str):
    """
    Return all predictions of a user
    """

    history = list(
        predictions_collection.find(
            {"email": email},   # FIXED (not username)
            {"_id": 0}
        )
    )

    return {"history": history}
