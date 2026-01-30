"""
Crop Prediction Routes
======================
- Predict crop
- Return top 3 crops
- Save prediction automatically with username
"""

from fastapi import APIRouter
from app.schemas.crop_schema import CropInput
from app.services.prediction import predict_crop
from app.database.mongodb import predictions_collection
from datetime import datetime, timezone
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["Crop Recommendation"])


# ---------------------------
# Extended input schema
# ---------------------------

class CropPredictionRequest(CropInput):
    username: str


@router.post("/predict")
def recommend_crop(payload: CropPredictionRequest):
    """
    Predict crop and store prediction history
    """

    top_crop, confidence, top_3 = predict_crop(payload)

    # Save to DB
    predictions_collection.insert_one({
        "username": payload.username,
        "inputs": payload.model_dump(exclude={"username"}),
        "top_crop": top_crop,
        "confidence": round(confidence * 100, 2),
        "top_3": top_3,
        "timestamp": datetime.now(timezone.utc)
    })

    return {
        "recommended_crop": top_crop,
        "confidence": round(confidence * 100, 2),
        "top_3": top_3
    }
