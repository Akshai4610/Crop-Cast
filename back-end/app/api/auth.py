"""
Authentication API
==================
Handles user registration and login with role-based access
"""

from fastapi import APIRouter, HTTPException
from app.database.mongodb import users_collection
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =======================
# Schemas
# =======================

class UserRegister(BaseModel):
    fullname: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "user"   # default role


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =======================
# Register
# =======================

@router.post("/register")
def register(user: UserRegister):
    """
    Register a new user
    """

    # Check if email already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    users_collection.insert_one({
        "fullname": user.fullname,
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    })

    return {"message": "User registered successfully"}


# =======================
# Login
# =======================

@router.post("/login")
def login(user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🚫 BLOCK CHECK (Feature 2 also here)
    if db_user.get("blocked", False):
        raise HTTPException(status_code=403, detail="User is banned")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🟢 UPDATE LAST SEEN
    users_collection.update_one(
        {"email": user.email},
        {"$set": {"last_seen": datetime.now(timezone.utc)}}
    )

    return {
        "fullname": db_user["fullname"],
        "email": db_user["email"],
        "role": db_user["role"]
    }
