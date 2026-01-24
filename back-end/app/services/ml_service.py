"""
ml_service.py

PURPOSE:
- Load trained ML model and label encoder
- Perform crop prediction based on weather inputs
- Used by FastAPI prediction routes
"""

import joblib
import numpy as np
from pathlib import Path


# Resolve model directory
MODEL_DIR = Path(__file__).resolve().parent.parent.parent / "ml" / "models"

# Load artifacts once (performance optimized)
model = joblib.load(MODEL_DIR / "crop_model.pkl")
label_encoder = joblib.load(MODEL_DIR / "label_encoder.pkl")


def predict_crop(temperature: float, humidity: float, rainfall: float) -> str:
    """
    Predict best crop based on weather parameters

    Args:
        temperature (float): Temperature in Celsius
        humidity (float): Humidity percentage
        rainfall (float): Rainfall in mm

    Returns:
        str: Recommended crop name
    """
    features = np.array([[temperature, humidity, rainfall]])
    prediction = model.predict(features)
    crop = label_encoder.inverse_transform(prediction)

    return crop[0]
