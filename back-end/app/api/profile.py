from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database.mongodb import users_collection

router = APIRouter(tags=["Profile"])


class Profile(BaseModel):
    fullname: str
    age: Optional[str] = ""
    location: Optional[str] = ""
    phone: Optional[str] = ""
    profile_pic: Optional[str] = ""
    cover_pic: Optional[str] = ""


# ==============================
# GET PROFILE
# ==============================
@router.get("/profile/{email:path}")
def get_profile(email: str):
    user = users_collection.find_one({"email": email}, {"_id": 0})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ==============================
# CREATE / UPDATE PROFILE
# ==============================
@router.post("/profile/{email:path}")
def save_profile(email: str, data: Profile):

    user = users_collection.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found. Register first.")

    users_collection.update_one(
        {"email": email},
        {"$set": data.dict()}
    )

    return {"msg": "Profile updated"}