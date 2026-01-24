"""
train_model.py

PURPOSE:
- Train machine learning model for crop recommendation
- Uses historical weather and crop data
- Saves trained model and label encoder for inference in FastAPI

USAGE:
- Run once to train and save model artifacts
- Do NOT run on every API request
"""

import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


# ----------------------------
# Load dataset
# ----------------------------
data = pd.read_csv("data/crop_data.csv")

# ----------------------------
# Feature selection
# ----------------------------
X = data[["temperature", "humidity", "rainfall"]]
y = data["crop"]

# ----------------------------
# Encode target labels
# ----------------------------
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# ----------------------------
# Train-test split
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# ----------------------------
# Model initialization
# ----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# ----------------------------
# Model training
# ----------------------------
model.fit(X_train, y_train)

# ----------------------------
# Save trained artifacts
# ----------------------------
joblib.dump(model, "models/crop_model.pkl")
joblib.dump(label_encoder, "models/label_encoder.pkl")

print("✅ Model and label encoder saved successfully")
