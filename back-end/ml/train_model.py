"""
train_model.py

PURPOSE:
- Load crop dataset
- Train ML model
- Save trained model for API use
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# -----------------------------
# LOAD DATASET
# -----------------------------

data_path = os.path.join("data", "crop_data.csv")
data = pd.read_csv(data_path)

# -----------------------------
# FEATURE SELECTION
# -----------------------------
# We use only weather-related features
X = data[["temperature", "humidity", "rainfall"]]
y = data["label"]

# -----------------------------
# ENCODE TARGET LABEL
# -----------------------------
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# -----------------------------
# TRAIN TEST SPLIT
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# -----------------------------
# MODEL TRAINING
# -----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)
model.fit(X_train, y_train)

# -----------------------------
# SAVE MODEL & ENCODER
# -----------------------------
os.makedirs("models", exist_ok=True)

joblib.dump(model, "models/crop_model.pkl")
joblib.dump(label_encoder, "models/label_encoder.pkl")

print("Model training completed and saved successfully")
