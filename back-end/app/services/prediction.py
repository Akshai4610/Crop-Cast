"""
Handles ML inference logic
--------------------------
This module loads the trained ML model once
and provides a prediction function used by API routes.
"""

import joblib
import pandas as pd
import os

# --------------------------------------------------
# Absolute path resolution (industry standard)
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
# BASE_DIR => back-end/

MODEL_PATH = os.path.join(BASE_DIR, "ml", "model", "crop_model.pkl")

# Safety check (very important in production)
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"ML model not found at: {MODEL_PATH}")

# --------------------------------------------------
# Load ML model ONCE (performance optimized)
# --------------------------------------------------

model = joblib.load(MODEL_PATH)

# --------------------------------------------------
# Prediction function
# --------------------------------------------------

def predict_crop(data):
    """
    Predict crop and confidence based on soil & weather inputs

    Parameters:
    - data: Pydantic request object (N, P, K, temperature, humidity, ph, rainfall)

    Returns:
    - predicted_crop (str)
    - confidence (float)
    """

    # Create DataFrame with EXACT feature names used during training
    features = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall
    }])

    # Predict crop label
    predicted_crop = model.predict(features)[0]

    # Predict confidence using probability
    probabilities = model.predict_proba(features)[0]
    class_index = list(model.classes_).index(predicted_crop)
    confidence = probabilities[class_index]

    return predicted_crop, float(confidence)
