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
            email, key = p.split(":", 1)
            # 🔥 LOWERCASE for case-insensitive lookup
            db[email.strip().lower()] = key.strip()
    return db


@router.get("/check")
def check_license(email: str = "", key: str = ""):
    # 🔥 LOWERCASE for case-insensitive lookup
    email_clean = (email or "").strip().lower()
    key_clean = (key or "").strip()

    license_map = get_license_map()
    valid_key = license_map.get(email_clean)

    if valid_key and key_clean == valid_key:
        return {"premium": True}

    return {"premium": False}