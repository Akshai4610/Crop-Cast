import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATA = os.path.join(BASE_DIR, "../dataset/crop_data.csv")
ADMIN_DATA = os.path.join(BASE_DIR, "../dataset/admin_dataset.csv")

# =========================
# LOAD DATASETS 🔥
# =========================
df1 = pd.read_csv(DEFAULT_DATA)

if os.path.exists(ADMIN_DATA):
    df2 = pd.read_csv(ADMIN_DATA)
    data = pd.concat([df1, df2], ignore_index=True)
    print("✅ Admin dataset merged")
else:
    data = df1
    print("⚠ No admin dataset found")

# =========================
# PREPARE DATA
# =========================
X = data.drop("label", axis=1)
y = data["label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42
)

model.fit(X_train, y_train)

# Accuracy
acc = accuracy_score(y_test, model.predict(X_test))
print(f"🔥 Accuracy: {acc * 100:.2f}%")

# Save
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/crop_model.pkl")

print("✅ Model saved with ADMIN + DEFAULT data")