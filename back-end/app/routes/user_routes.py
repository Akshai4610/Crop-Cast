"""
user_routes.py

PURPOSE:
- Handle user-related API endpoints
"""

from fastapi import APIRouter, HTTPException
from app.database import get_database
from app.models.user_model import user_document
from app.schemas.user_schema import UserCreate, UserUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])

# CREATE USER
@router.post("/{}")
async def create_user(user: UserCreate):
    """
    Create a new user
    """
    db = get_database()
    
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    user_data = user_document(user.dict())
    result = await db.users.insert_one(user_data)

    return {
        "message": "User created successfully",
        "user_id": str(result.inserted_id)
    }


# GET USER BY ID
@router.get("/{user_id}")
async def get_user(user_id: str):
    """
    Fetch user profile by ID
    """
    db = get_database()

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    return user


# UPDATE USER
@router.put("/{user_id}")
async def update_user(user_id: str, user: UserUpdate):
    """
    Update user profile
    """
    db = get_database()

    update_data = {k: v for k, v in user.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}


# DELETE USER
@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """
    Delete user account
    """
    db = get_database()

    result = await db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
