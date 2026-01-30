"""
Handles ML inference logic
--------------------------
- Loads model once
- Predicts top 3 crops with probabilities
"""

import joblib
import pandas as pd
import os

# --------------------------------------------------
# Path resolution
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model", "crop_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

# --------------------------------------------------
# Load model ONCE
# --------------------------------------------------

model = joblib.load(MODEL_PATH)

# --------------------------------------------------
# Prediction functions
# --------------------------------------------------

def predict_crop(data):
    """
    Returns:
    - top_crop (str)
    - confidence (float 0–1)
    - top_3 list
    """

    features = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall
    }])

    probs = model.predict_proba(features)[0]
    crops = model.classes_

    crop_probs = list(zip(crops, probs))
    crop_probs.sort(key=lambda x: x[1], reverse=True)

    top_3 = [
        {"crop": crop, "probability": round(prob * 100, 2)}
        for crop, prob in crop_probs[:3]
    ]

    return top_3[0]["crop"], probs.max(), top_3
