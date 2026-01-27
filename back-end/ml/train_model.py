"""
Train Crop Recommendation Model
--------------------------------
This script trains a machine learning model
using agricultural data and saves it for inference.
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# Load dataset
DATA_PATH = "../dataset/crop_data.csv"
data = pd.read_csv(DATA_PATH)

# Split features and label
X = data.drop("label", axis=1)
y = data["label"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

# Train model
model.fit(X_train, y_train)

# Evaluate
accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/crop_model.pkl")

print("Model saved as crop_model.pkl")