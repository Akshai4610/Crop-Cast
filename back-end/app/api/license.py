from fastapi import APIRouter
import os

router = APIRouter(prefix="/license", tags=["License"])

# 🔐 Load from .env
def get_license_map():
    raw = os.getenv("LICENSE_KEYS", "")
    pairs = raw.split(",")

    db = {}
    for p in pairs:
        if ":" in p:
            email, key = p.split(":")
            db[email.strip()] = key.strip()
    return db


@router.get("/check")
def check_license(email: str, key: str):
    print("EMAIL:", email)
    print("KEY:", key)

    license_db = get_license_map()   # ✅ FIX
    valid_key = license_db.get(email)

    print("VALID KEY:", valid_key)

    if valid_key and key == valid_key:
        return {"premium": True}

    return {"premium": False}