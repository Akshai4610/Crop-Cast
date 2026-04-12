from fastapi import APIRouter, HTTPException, Request, Depends
from app.database.mongodb import users_collection, activities_collection
from app.core.dependencies import user_required
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from app.core.security import create_access_token
from app.core.rate_limiter import check_rate_limit
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.api.license import get_license_map

# 🔥 FIFO LOGGER (MAX 10)
def log_activity(name, email, action):
    try:
        # 🆔 IDENTIFY USER (Use email prefix if name is generic)
        display_name = name
        if not name or name.lower() == "user":
            display_name = email.split("@")[0]

        # Check current count
        count = activities_collection.count_documents({})
        if count >= 10:
            # Delete 1st (oldest) entry
            oldest = activities_collection.find().sort("timestamp", 1).limit(1)
            for doc in oldest:
                activities_collection.delete_one({"_id": doc["_id"]})
        
        # Insert new activity
        activities_collection.insert_one({
            "name": display_name,
            "email": email,
            "action": action,
            "timestamp": datetime.utcnow()
        })
    except Exception as e:
        print(f"Activity Logging Error: {e}")


router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

limiter = Limiter(key_func=get_remote_address)

# =======================
# SCHEMAS
# =======================
class UserRegister(BaseModel):
    fullname: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =======================
# REGISTER
# =======================
@router.post("/register")
def register(user: UserRegister):

    if users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "Email already exists")

    hashed = pwd_context.hash(user.password)

    users_collection.insert_one({
        "fullname": user.fullname,
        "email": user.email,
        "password": hashed,
        "role": user.role,
        "blocked": False,
        "created_at": datetime.utcnow()
    })

    return {"message": "User registered successfully"}


# =======================
# LOGIN
# =======================
@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, user: UserLogin):

    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(401, "Invalid credentials")

    if db_user.get("blocked"):
        raise HTTPException(403, "User is banned")

    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({
        "email": db_user["email"],
        "role": db_user["role"]
    })

    # Check for premium key
    license_db = get_license_map()
    premium_key = license_db.get(db_user["email"])

    response_data = {
        "access_token": token,
        "token_type": "bearer",
        "email": db_user["email"],
        "fullname": db_user.get("fullname", "User"),
        "role": db_user["role"]
    }
    
    if premium_key:
        response_data["premium_key"] = premium_key

    # 🔥 LOG LOGIN (FIFO)
    log_activity(db_user.get("fullname", "User"), db_user["email"], "login")
        
    return response_data


# =======================
# LOGOUT
# =======================
@router.post("/logout")
def logout(user=Depends(user_required)):
    # 🔥 LOG LOGOUT (FIFO)
    log_activity(user.get("fullname", "User"), user["email"], "logout")
    return {"message": "Logged out successfully"}