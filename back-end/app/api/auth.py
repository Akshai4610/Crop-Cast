"""
Authentication API
-----------------
Handles user registration and login with role-based access
Roles:
- admin
- user
"""

from fastapi import APIRouter, HTTPException
from app.database.mongodb import users_collection
from passlib.context import CryptContext
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    username: str
    password: str
    role: str = "user"  # default role

@router.post("/register")
def register(user: User):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = pwd_context.hash(user.password)
    users_collection.insert_one({
        "username": user.username,
        "password": hashed,
        "role": user.role
    })
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: User):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"username": db_user["username"], "role": db_user["role"]}
