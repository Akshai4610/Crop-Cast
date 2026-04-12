"""
Prediction API
==============
Responsibilities:
✔ Run ML prediction
✔ Save prediction automatically
✔ Return result to frontend
✔ Provide history
"""

from typing import List

from fastapi import Query, APIRouter, BackgroundTasks
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel

from app.database.mongodb import predictions_collection
from app.services.prediction import predict_crop


# ======================================================
# Router
# Final routes:
# POST   /api/predictions
# GET    /api/predictions/{email}
# ======================================================
router = APIRouter(prefix="/predictions", tags=["Predictions"])


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
# 🔹 HELPER: Background Save
# ======================================================
def save_prediction_background(email: str, input_data: dict, result: dict):
    try:
        predictions_collection.insert_one({
            "email": email,
            "input_data": input_data,
            "predicted_crop": result["predicted_crop"],
            "confidence": result["confidence"],
            "top_3": result["top_3"],
            "timestamp": datetime.now(timezone.utc)
        })
    except Exception as e:
        print(f"Error saving prediction to DB: {e}")

# ======================================================
# 🔹 Predict + Save
# ======================================================
@router.post("")
def predict_and_save(pred: PredictionRequest, background_tasks: BackgroundTasks):
    """
    Steps:
    1. Call ML model
    2. Save result in MongoDB (Background)
    3. Return result instantly
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
    
    # Save to DB in background thread to reduce latency
    background_tasks.add_task(save_prediction_background, pred.email, input_data, result)

    return result

# ======================================================
# 🔹 GET HISTORY (WITH PAGINATION + FILTER + DELETE READY)
# ======================================================
@router.get("")
def get_prediction_history(
    email: str = Query(...),
    range: str = Query("all"),   # 1h, 24h, 7d, 4w, all
):
    
    now = datetime.now(timezone.utc)

    filter_query = {"email": email}

    # 🔥 TIME FILTER
    if range != "all":
        if range == "1h":
            time_limit = now - timedelta(hours=1)
        elif range == "24h":
            time_limit = now - timedelta(hours=24)
        elif range == "7d":
            time_limit = now - timedelta(days=7)
        elif range == "4w":
            time_limit = now - timedelta(weeks=4)
        else:
            time_limit = None

        if time_limit:
            filter_query["timestamp"] = {"$gte": time_limit}

    history = list(
        predictions_collection.find(filter_query, {"_id": 0})
        .sort("timestamp", -1)
    )

    return {"history": history}

# ======================================================
# ❌ DELETE HISTORY ITEM (RANGE OR INDIVIDUAL)
# ======================================================
from typing import List, Optional
from fastapi import Query

@router.delete("")
def delete_history(
    email: str = Query(...),
    range: Optional[str] = Query(None),
    timestamps: Optional[List[str]] = Query(None),
):
    filter_query = {"email": email}

    # ✅ PRIORITY 1 → DELETE SELECTED ITEMS ONLY
    if timestamps and len(timestamps) > 0:
        ts_list = [datetime.fromisoformat(ts) for ts in timestamps]

        filter_query["timestamp"] = {"$in": ts_list}

        result = predictions_collection.delete_many(filter_query)

        return {
            "message": "Selected items deleted",
            "count": result.deleted_count
        }

    # ✅ PRIORITY 2 → RANGE DELETE
    if range:
        now = datetime.now(timezone.utc)

        if range == "1h":
            time_limit = now - timedelta(hours=1)
        elif range == "24h":
            time_limit = now - timedelta(hours=24)
        elif range == "7d":
            time_limit = now - timedelta(days=7)
        elif range == "4w":
            time_limit = now - timedelta(weeks=4)
        elif range == "all":
            result = predictions_collection.delete_many({"email": email})
            return {"message": "All deleted", "count": result.deleted_count}
        else:
            return {"message": "Invalid range", "count": 0}

        filter_query["timestamp"] = {"$gte": time_limit}

        result = predictions_collection.delete_many(filter_query)

        return {
            "message": "Range deleted",
            "count": result.deleted_count
        }

    return {"message": "Nothing deleted", "count": 0}