import os
import joblib
import shutil
import pandas as pd
import time  # ✅ REQUIRED

from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

router = APIRouter(prefix="/admin/dataset", tags=["Admin Dataset"])

# ================= PATH =================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

ORIGINAL_CSV = os.path.join(DATASET_DIR, "crop_data.csv")
ADMIN_CSV = os.path.join(DATASET_DIR, "admin_dataset.csv")

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
BACKUP_PATH = os.path.join(BASE_DIR, "model_backup.pkl")

COLUMNS = ["N","P","K","temperature","humidity","ph","rainfall","label"]
NUMERIC = ["N","P","K","temperature","humidity","ph","rainfall"]

# ================= STATUS =================
training_status = {
    "status": "Idle",
    "progress": 0,
    "accuracy": 0,
    "last_trained": None,
    "dataset_changed": False
}

# ================= CSV SAFE =================
def read_csv_safe(path):
    if not os.path.exists(path):
        return pd.DataFrame(columns=COLUMNS)

    try:
        df = pd.read_csv(path, on_bad_lines="skip")
        df = df.reindex(columns=COLUMNS)
        return df.dropna()
    except:
        return pd.DataFrame(columns=COLUMNS)

# ================= WRITE CSV =================
def write_csv(df):
    for col in NUMERIC:
        df[col] = df[col].apply(
            lambda x: int(float(x)) if float(x).is_integer() else float(x)
        )

    # ✅ FIX: remove .0 issue completely
    for col in NUMERIC:
        df[col] = pd.to_numeric(df[col], errors="coerce")

        if (df[col] % 1 == 0).all():
            df[col] = df[col].astype("Int64")

    df = df[COLUMNS]
    df.to_csv(ADMIN_CSV, index=False)

# ================= VALIDATION =================
def validate(row):
    for col in COLUMNS:
        if col not in row or row[col] in ["", None]:
            raise HTTPException(400, f"{col} required")

    for col in NUMERIC:
        val = float(row[col])
        row[col] = int(val) if val.is_integer() else val

    row["label"] = str(row["label"]).strip().lower()
    return row

# ================= DUPLICATE =================
def is_duplicate(row, ignore_index=None):
    df = pd.concat([
        read_csv_safe(ORIGINAL_CSV),
        read_csv_safe(ADMIN_CSV)
    ], ignore_index=True)

    if ignore_index is not None and ignore_index < len(df):
        df = df.drop(ignore_index)

    match = df[
        (df["N"] == row["N"]) &
        (df["P"] == row["P"]) &
        (df["K"] == row["K"]) &
        (df["temperature"] == row["temperature"]) &
        (df["humidity"] == row["humidity"]) &
        (df["ph"] == row["ph"]) &
        (df["rainfall"] == row["rainfall"])
    ]

    return not match.empty

# ================= APPEND =================
def append_csv(row):
    df = read_csv_safe(ADMIN_CSV)
    df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    write_csv(df)

# ================= TRAIN =================
def run_training():
    global training_status

    try:
        # 🔥 RESET PROGRESS
        training_status.update({
            "status": "Training",
            "progress": 0
        })

        # ================= STEP 1 =================
        time.sleep(0.5)
        training_status["progress"] = 10

        df = pd.concat([
            read_csv_safe(ORIGINAL_CSV),
            read_csv_safe(ADMIN_CSV)
        ], ignore_index=True).dropna()

        if df.empty:
            raise Exception("No data")

        # ================= STEP 2 =================
        time.sleep(0.5)
        training_status["progress"] = 30

        X = df.drop("label", axis=1)
        y = df["label"]

        # ================= STEP 3 =================
        time.sleep(0.5)
        training_status["progress"] = 55

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2
        )

        # ================= STEP 4 =================
        time.sleep(0.5)
        training_status["progress"] = 75

        model = RandomForestClassifier()
        model.fit(X_train, y_train)

        # ================= STEP 5 =================
        time.sleep(0.5)
        training_status["progress"] = 90

        acc = accuracy_score(y_test, model.predict(X_test)) * 100

        if os.path.exists(MODEL_PATH):
            shutil.copy(MODEL_PATH, BACKUP_PATH)

        joblib.dump(model, MODEL_PATH)

        # ================= FINAL =================
        time.sleep(0.5)

        training_status.update({
            "status": "Completed",
            "progress": 100,
            "accuracy": round(acc, 2),
            "last_trained": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "dataset_changed": False
        })

    except Exception as e:
        print("❌ Training Error:", str(e))

        if os.path.exists(BACKUP_PATH):
            shutil.copy(BACKUP_PATH, MODEL_PATH)

        training_status.update({
            "status": "Failed",
            "progress": 0
        })

# ================= CRUD =================
@router.get("/")
async def get_dataset():
    df = read_csv_safe(ADMIN_CSV)
    return {"data": df.to_dict(orient="records"), "total": len(df)}

@router.post("/")
async def add_row(row: dict, bg: BackgroundTasks):
    row = validate(row)

    if is_duplicate(row):
        raise HTTPException(400, "Duplicate dataset")

    append_csv(row)

    # 🔥 IMPORTANT: mark dataset changed BEFORE training
    training_status["dataset_changed"] = True

    return {"message": "Added"}

@router.put("/{index}")
async def update_row(index: int, row: dict, bg: BackgroundTasks):
    df = read_csv_safe(ADMIN_CSV)

    if index >= len(df):
        raise HTTPException(404, "Not found")

    row = validate(row)

    if is_duplicate(row, index):
        raise HTTPException(400, "Duplicate dataset")

    df.iloc[index] = row
    write_csv(df)

    training_status["dataset_changed"] = True

    return {"message": "Updated"}

@router.delete("/{index}")
async def delete_row(index: int, bg: BackgroundTasks):
    df = read_csv_safe(ADMIN_CSV)

    if index >= len(df):
        raise HTTPException(404, "Not found")

    df = df.drop(index).reset_index(drop=True)
    write_csv(df)

    training_status["dataset_changed"] = True

    bg.add_task(run_training)

    return {"message": "Deleted"}

# ================= TRAIN =================
@router.get("/training-status")
async def status():
    return training_status

@router.post("/retrain")
async def retrain(bg: BackgroundTasks):
    if training_status["status"] == "Training":
        return {"message": "Already running"}

    # 🔥 FORCE RETRAIN STATE
    training_status["dataset_changed"] = True

    bg.add_task(run_training)

    return {"message": "Started"}