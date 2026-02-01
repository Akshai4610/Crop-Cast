"""
Prediction Service (Professional Version)
-----------------------------------------
Responsibilities:
✔ Load model only once
✔ Validate input safely
✔ Run ML inference
✔ Return top 3 crops with confidence
✔ Log activity for debugging
✔ Never crash server
"""

import joblib
import pandas as pd
import os
import logging


# ==================================================
# Logging setup
# ==================================================

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


# ==================================================
# Path resolution
# ==================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

MODEL_PATH = os.path.join(BASE_DIR, "ml", "model", "crop_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")


# ==================================================
# Load model ONCE (important for performance)
# ==================================================

logger.info("Loading ML model...")
model = joblib.load(MODEL_PATH)
logger.info("Model loaded successfully")


# ==================================================
# Validation helper
# ==================================================

REQUIRED_FIELDS = [
    "N", "P", "K",
    "temperature", "humidity", "ph", "rainfall"
]


def validate_input(data: dict):
    """
    Ensures:
    ✔ all fields exist
    ✔ numeric values only
    """

    for field in REQUIRED_FIELDS:
        if field not in data:
            raise ValueError(f"{field} is missing")

        if data[field] is None:
            raise ValueError(f"{field} cannot be null")

        if not isinstance(data[field], (int, float)):
            raise ValueError(f"{field} must be numeric")


# ==================================================
# Main prediction function
# ==================================================

def predict_crop(data: dict):
    """
    Parameters:
        data (dict)

    Returns:
        {
            predicted_crop,
            confidence,
            top_3
        }
    """

    try:
        logger.info("Prediction requested")

        # ------------------------
        # Validate input
        # ------------------------
        validate_input(data)

        # ------------------------
        # Create dataframe
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

        top_3 = [
            {"crop": crop, "probability": round(prob * 100, 2)}
            for crop, prob in crop_probs[:3]
        ]

        result = {
            "predicted_crop": top_3[0]["crop"],
            "confidence": round(max(probs), 4),
            "top_3": top_3
        }

        logger.info(f"Prediction success → {result['predicted_crop']}")

        return result

    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise
