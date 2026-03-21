# ==========================================================
# Admin Dataset Management (Production Architecture)
# ==========================================================

import os
import joblib
import shutil
import pandas as pd

from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, BackgroundTasks
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from app.database.mongodb import db

router = APIRouter(prefix="/admin/dataset", tags=["Admin Dataset"])

# ==========================================================
# 📁 PATH CONFIGURATION
# ==========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

os.makedirs(DATASET_DIR, exist_ok=True)

ORIGINAL_CSV = os.path.join(DATASET_DIR, "crop_data.csv")
ADMIN_CSV = os.path.join(DATASET_DIR, "admin_dataset.csv")

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
BACKUP_PATH = os.path.join(BASE_DIR, "model_backup.pkl")

# ==========================================================
# 📊 GLOBAL TRAINING STATE (In-Memory Tracker)
# ==========================================================

training_status = {
    "status": "Idle",            # Idle | Training | Completed | Failed
    "progress": 0,
    "accuracy": 0,
    "last_trained": None,
    "total_models_trained": 0,
    "dataset_changed": False
}

NUMERIC_FIELDS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]


# ==========================================================
# 🔎 VALIDATION
# ==========================================================

def validate_row(row: dict):
    required = NUMERIC_FIELDS + ["label"]

    for field in required:
        if field not in row or row[field] in ["", None]:
            raise HTTPException(status_code=400, detail=f"{field} is required")

    try:
        for field in NUMERIC_FIELDS:
            row[field] = float(row[field])
    except:
        raise HTTPException(status_code=400, detail="Numeric values invalid")

    return row


# ==========================================================
# 🔁 DUPLICATE CHECK
# ==========================================================

def is_duplicate(row, ignore_id=None):

    query = row.copy()

    if ignore_id:
        query["_id"] = {"$ne": ObjectId(ignore_id)}

    # Mongo Check
    if db.dataset.find_one(query):
        return True

    # CSV Check
    for path in [ORIGINAL_CSV, ADMIN_CSV]:
        if not os.path.exists(path):
            continue

        df = pd.read_csv(path)

        match = df[
            (df["N"] == row["N"]) &
            (df["P"] == row["P"]) &
            (df["K"] == row["K"]) &
            (df["temperature"] == row["temperature"]) &
            (df["humidity"] == row["humidity"]) &
            (df["ph"] == row["ph"]) &
            (df["rainfall"] == row["rainfall"]) &
            (df["label"] == row["label"])
        ]

        if not match.empty:
            return True

    return False


# ==========================================================
# 🧠 BACKGROUND TRAINING ENGINE
# ==========================================================

def run_training():

    global training_status

    try:
        training_status["dataset_changed"] = False
        training_status["last_trained"] = datetime.now()
        training_status["total_models_trained"] += 1
        training_status["status"] = "Training"
        training_status["progress"] = 10

        df1 = pd.read_csv(ORIGINAL_CSV)
        df2 = pd.read_csv(ADMIN_CSV) if os.path.exists(ADMIN_CSV) else pd.DataFrame()

        df = pd.concat([df1, df2], ignore_index=True)

        if df.empty:
            raise Exception("No data to train")

        X = df.drop("label", axis=1)
        y = df["label"]

        training_status["progress"] = 40

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = RandomForestClassifier()
        model.fit(X_train, y_train)

        training_status["progress"] = 70

        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred) * 100

        # Backup old model
        if os.path.exists(MODEL_PATH):
            shutil.copy(MODEL_PATH, BACKUP_PATH)

        joblib.dump(model, MODEL_PATH)

        # Update metadata
        training_status["accuracy"] = round(accuracy, 2)
        training_status["last_trained"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        training_status["total_models_trained"] += 1
        training_status["progress"] = 100
        training_status["status"] = "Completed"

    except Exception as e:

        # Rollback if failure
        if os.path.exists(BACKUP_PATH):
            shutil.copy(BACKUP_PATH, MODEL_PATH)

        training_status["status"] = "Failed"
        training_status["progress"] = 0


# ==========================================================
# ➕ ADD ROW (AUTO RETRAIN ENABLED)
# ==========================================================

@router.post("/")
async def add_row(row: dict, background_tasks: BackgroundTasks):

    row = validate_row(row)

    if is_duplicate(row):
        raise HTTPException(status_code=400, detail="Row already exists")

    result = db.dataset.insert_one(row)
    row["_id"] = str(result.inserted_id)

    pd.DataFrame([row]).drop(columns=["_id"]).to_csv(
        ADMIN_CSV,
        mode="a",
        header=not os.path.exists(ADMIN_CSV),
        index=False
    )

    # 🔥 AUTO RETRAIN
    background_tasks.add_task(run_training)

    return {"message": "Row added & model retraining started"}


# ==========================================================
# ✏ UPDATE ROW (FIXED 400 ERROR)
# ==========================================================

@router.put("/{id}")
async def update_row(id: str, data: dict, background_tasks: BackgroundTasks):

    existing = db.dataset.find_one({"_id": ObjectId(id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Row not found")

    data = validate_row(data)

    if is_duplicate(data, ignore_id=id):
        raise HTTPException(status_code=400, detail="Duplicate row exists")

    db.dataset.update_one({"_id": ObjectId(id)}, {"$set": data})

    background_tasks.add_task(run_training)

    return {"message": "Updated & retraining started"}


# ==========================================================
# ❌ DELETE ROW
# ==========================================================

@router.delete("/{id}")
async def delete_row(id: str, background_tasks: BackgroundTasks):

    row = db.dataset.find_one({"_id": ObjectId(id)})
    if not row:
        raise HTTPException(status_code=404, detail="Row not found")

    db.dataset.delete_one({"_id": ObjectId(id)})

    background_tasks.add_task(run_training)

    return {"message": "Deleted & retraining started"}

# ==========================================================
# 📋 GET DATASET (WITH PAGINATION)
# ==========================================================

@router.get("/")
async def get_dataset(page: int = 1, limit: int = 50):

    skip = (page - 1) * limit

    total = db.dataset.count_documents({})

    rows = list(
        db.dataset.find()
        .skip(skip)
        .limit(limit)
    )

    for r in rows:
        r["_id"] = str(r["_id"])

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": rows
    }

# ==========================================================
# 📊 GET TRAINING STATUS (FOR FRONTEND POLLING)
# ==========================================================

@router.get("/training-status")
async def get_training_status():
    return training_status


# ==========================================================
# 🚀 MANUAL RETRAIN
# ==========================================================

@router.post("/retrain")
async def retrain_model(background_tasks: BackgroundTasks):

    if training_status["status"] == "Training":
        return {"message": "Training already running"}

    background_tasks.add_task(run_training)

    return {"message": "Training started"}


# ==========================================================
# 📈 MODEL METRICS
# ==========================================================

@router.get("/model-metrics")
async def model_metrics():
    return training_status