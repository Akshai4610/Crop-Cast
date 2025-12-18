"""
history_model.py

PURPOSE:
- Define MongoDB structure for prediction history
- Used when storing ML results
"""

from datetime import datetime

def history_document(data: dict) -> dict:
    """
    Converts incoming history data into MongoDB document
    """
    return {
        "user_id": data["user_id"],              # Reference to user
        "location": data["location"],            # Location of prediction
        "temperature": data["temperature"],      # Weather data
        "humidity": data["humidity"],
        "rainfall": data["rainfall"],
        "recommended_crop": data["recommended_crop"],  # ML output
        "created_at": datetime.utcnow()           # Prediction timestamp
    }
