"""
Admin Users API
================
Manage registered users
"""

from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from app.database.mongodb import users_collection
from app.core.dependencies import admin_required

router = APIRouter(prefix="/admin/users", tags=["Admin Users"])


# ==========================
# Get all users
# ==========================
@router.get("/")
def get_users(page: int = 1, limit: int = 10, search: str = "", sort: str = "", admin = Depends(admin_required)):

    query = {}

    if search:
        query["fullname"] = {"$regex": search, "$options": "i"}

    total = users_collection.count_documents(query)

    sort_order = 1 if sort == "az" else -1

    users = users_collection.find(query)\
        .sort("fullname", sort_order)\
        .skip((page - 1) * limit)\
        .limit(limit)

    user_list = []

    for u in users:
        user_list.append({
            "id": str(u["_id"]),
            "fullname": u.get("fullname", ""),
            "email": u.get("email", ""),
            "blocked": u.get("blocked", False),
            "last_seen": u.get("last_seen"),
            "profile_pic": u.get("profile_pic", ""),
            "location": u.get("location", "")
        })
    total_users = users_collection.count_documents({})
    blocked_users = users_collection.count_documents({"blocked": True})

    return {
        "users": user_list,
        "total": total,
        "page": page,
        "stats": {
            "total": total_users,
            "blocked": blocked_users,
            "active": total_users - blocked_users
        }
    }


# ==========================
# Delete user
# ==========================
@router.delete("/{user_id}", dependencies=[Depends(admin_required)])
def delete_user(user_id: str):

    result = users_collection.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted"}


# ==========================
# Block / Unblock user
# ==========================
@router.put("/block/{user_id}", dependencies=[Depends(admin_required)])
def block_user(user_id: str):

    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_status = not user.get("blocked", False)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"blocked": new_status}}
    )

    return {"blocked": new_status}