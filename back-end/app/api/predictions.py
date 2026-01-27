"""
Prediction API
---------------
Stores prediction results in MongoDB
Shows history per user
"""

from fastapi import APIRouter
from app.database.mongodb import predictions_collection
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])

class PredictionInput(BaseModel):
    username: str
    input_data: dict
    predicted_crop: str
    confidence: float

@router.post("/add")
def add_prediction(pred: PredictionInput):
    predictions_collection.insert_one({
        "username": pred.username,
        "input_data": pred.input_data,
        "predicted_crop": pred.predicted_crop,
        "confidence": pred.confidence,
        "timestamp": datetime.utcnow()
    })
    return {"message": "Prediction stored successfully"}

@router.get("/{username}")
def get_history(username: str):
    preds = list(predictions_collection.find({"username": username}, {"_id": 0}))
    return {"history": preds}
