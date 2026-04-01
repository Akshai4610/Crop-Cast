"""
Prediction Service (Final Clean + Production Version)
----------------------------------------------------
✔ Safe input validation
✔ Case normalization
✔ Top 3 predictions
✔ Confidence %
✔ Stable (never crashes)
"""

import joblib
import pandas as pd
import os
import logging


# ==================================================
# Logging
# ==================================================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ==================================================
# Paths
# ==================================================
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

MODEL_PATH = os.path.join(BASE_DIR, "ml", "model", "crop_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")


# ==================================================
# Load Model ONCE
# ==================================================
logger.info("Loading ML model...")
model = joblib.load(MODEL_PATH)
logger.info("Model loaded successfully")


# ==================================================
# Required fields
# ==================================================
REQUIRED_FIELDS = [
    "N", "P", "K",
    "temperature", "humidity", "ph", "rainfall"
]


# ==================================================
# Validation
# ==================================================
def validate_input(data: dict):
    for field in REQUIRED_FIELDS:
        if field not in data:
            raise ValueError(f"{field} is missing")

        if data[field] is None:
            raise ValueError(f"{field} cannot be null")

        if not isinstance(data[field], (int, float)):
            raise ValueError(f"{field} must be numeric")


# ==================================================
# Normalize crop name (VERY IMPORTANT 🔥)
# ==================================================
def normalize_crop_name(name: str):
    """
    Convert:
    muskmelon → Muskmelon
    rice → Rice
    """
    return name.strip().capitalize()


# ==================================================
# Prediction Function
# ==================================================
def predict_crop(data: dict):

    try:
        logger.info("Prediction started")

        # ------------------------
        # Validate input
        # ------------------------
        validate_input(data)

        # ------------------------
        # DataFrame
        # ------------------------
        features = pd.DataFrame([{
            "N": data["N"],
            "P": data["P"],
            "K": data["K"],
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "ph": data["ph"],
            "rainfall": data["rainfall"]
        }])

        # ------------------------
        # Predict
        # ------------------------
        probs = model.predict_proba(features)[0]
        crops = model.classes_

        crop_probs = list(zip(crops, probs))
        crop_probs.sort(key=lambda x: x[1], reverse=True)

        # ------------------------
        # Top 3
        # ------------------------
        top_3 = []
        for crop, prob in crop_probs[:3]:
            top_3.append({
                "crop": normalize_crop_name(crop),   # ✅ FIXED
                "probability": round(prob * 100, 2)
            })

        # ------------------------
        # Final Result
        # ------------------------
        best_crop = normalize_crop_name(crop_probs[0][0])
        confidence_raw = max(probs)

        result = {
            "predicted_crop": best_crop,
            "confidence": round(confidence_raw, 4),
            "confidence_percent": round(confidence_raw * 100, 2),  # ✅ NEW
            "top_3": top_3
        }

        logger.info(f"Prediction success → {best_crop}")

        return result

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise