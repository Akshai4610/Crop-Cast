"""
predict_routes.py

PURPOSE:
- Load trained ML model
- Accept weather inputs
- Predict crop
- Save prediction history
"""

import joblib
import os
from fastapi import APIRouter, HTTPException
from app.database import get_database
from app.models.history_model import history_document

router = APIRouter(prefix="/predict", tags=["Prediction"])

# -----------------------------
# LOAD MODEL & ENCODER ONCE
# -----------------------------

MODEL_PATH = os.path.join("ml", "models", "crop_model.pkl")
ENCODER_PATH = os.path.join("ml", "models", "label_encoder.pkl")

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

# -----------------------------
# PREDICTION ENDPOINT
# -----------------------------
@router.post("/")
async def predict_crop(data: dict):
    """
    Accept weather input and predict best crop
    """

    try:
        temperature = data["temperature"]
        humidity = data["humidity"]
        rainfall = data["rainfall"]
        user_id = data["user_id"]
        location = data["location"]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid input data")

    # -----------------------------
    # ML PREDICTION
    # -----------------------------
    features = [[temperature, humidity, rainfall]]
    prediction = model.predict(features)
    crop = label_encoder.inverse_transform(prediction)[0]

    # -----------------------------
    # SAVE HISTORY
    # -----------------------------
    db = get_database()

    history_data = history_document({
        "user_id": user_id,
        "location": location,
        "temperature": temperature,
        "humidity": humidity,
        "rainfall": rainfall,
        "recommended_crop": crop
    })

    await db.history.insert_one(history_data)

    return {
        "recommended_crop": crop
    }
