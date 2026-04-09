"""
====================================================
📰 NEWS API (SECURE + CLEAN ARCHITECTURE)
✔ JWT Protected (User + Admin)
✔ No email from frontend (uses token)
✔ Safe ObjectId handling
✔ Like/Dislike toggle
✔ Comments system
✔ Pagination ready
====================================================
"""

from fastapi import APIRouter, HTTPException, Depends, Form, Body, Query
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from app.database.mongodb import news_collection
from app.core.dependencies import admin_required, user_required

router = APIRouter(prefix="/news", tags=["News"])


# =========================================
# 🔁 SERIALIZER
# =========================================
def serialize(news):
    news["_id"] = str(news["_id"])
    return news


# =========================================
# 🔧 HELPER: VALIDATE OBJECT ID
# =========================================
def get_object_id(news_id: str):
    try:
        return ObjectId(news_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid News ID")


# =========================================
# 📝 SCHEMAS
# =========================================
class CommentDelete(BaseModel):
    text: str


# =========================================
# ================= USER ===================
# =========================================

# 📥 GET NEWS (PUBLIC)
@router.get("/")
def get_news(
    category: str = Query(default=None),
    skip: int = 0,
    limit: int = 10
):
    query = {"category": category} if category else {}

    news_cursor = (
        news_collection.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )

    return [serialize(n) for n in news_cursor]


# 👍 LIKE / UNLIKE
@router.post("/{news_id}/like")
def like_news(
    news_id: str,
    user=Depends(user_required)
):
    obj_id = get_object_id(news_id)

    news = news_collection.find_one({"_id": obj_id})
    if not news:
        raise HTTPException(404, "News not found")

    email = user["email"]

    liked = news.get("likedBy", [])
    disliked = news.get("dislikedBy", [])

    # 🔁 TOGGLE LIKE
    if email in liked:
        news_collection.update_one(
            {"_id": obj_id},
            {
                "$pull": {"likedBy": email},
                "$inc": {"likes": -1}
            }
        )
    else:
        update = {
            "$addToSet": {"likedBy": email},
            "$inc": {"likes": 1}
        }

        if email in disliked:
            update["$pull"] = {"dislikedBy": email}
            update["$inc"]["dislikes"] = -1

        news_collection.update_one({"_id": obj_id}, update)

    updated = news_collection.find_one({"_id": obj_id})
    return serialize(updated)


# 👎 DISLIKE / UNDISLIKE
@router.post("/{news_id}/dislike")
def dislike_news(
    news_id: str,
    user=Depends(user_required)
):
    obj_id = get_object_id(news_id)

    news = news_collection.find_one({"_id": obj_id})
    if not news:
        raise HTTPException(404, "News not found")

    email = user["email"]

    liked = news.get("likedBy", [])
    disliked = news.get("dislikedBy", [])

    if email in disliked:
        news_collection.update_one(
            {"_id": obj_id},
            {
                "$pull": {"dislikedBy": email},
                "$inc": {"dislikes": -1}
            }
        )
    else:
        update = {
            "$addToSet": {"dislikedBy": email},
            "$inc": {"dislikes": 1}
        }

        if email in liked:
            update["$pull"] = {"likedBy": email}
            update["$inc"]["likes"] = -1

        news_collection.update_one({"_id": obj_id}, update)

    updated = news_collection.find_one({"_id": obj_id})
    return serialize(updated)


# 💬 ADD COMMENT
@router.post("/{news_id}/comments")
def add_comment(
    news_id: str,
    text: str = Form(...),
    user=Depends(user_required)
):
    obj_id = get_object_id(news_id)

    news = news_collection.find_one({"_id": obj_id})
    if not news:
        raise HTTPException(404, "News not found")

    comment = {
        "user": user["email"],   # 🔥 from token
        "text": text,
        "created_at": datetime.utcnow()
    }

    news_collection.update_one(
        {"_id": obj_id},
        {"$push": {"comments": comment}}
    )

    return {"message": "Comment added"}


# 📥 GET COMMENTS
@router.get("/{news_id}/comments")
def get_comments(news_id: str):
    obj_id = get_object_id(news_id)

    news = news_collection.find_one({"_id": obj_id})
    if not news:
        raise HTTPException(404, "News not found")

    return news.get("comments", [])


# ❌ DELETE COMMENT
@router.delete("/{news_id}/comments")
def delete_comment(
    news_id: str,
    data: CommentDelete,
    user=Depends(user_required)
):
    obj_id = get_object_id(news_id)

    news = news_collection.find_one({"_id": obj_id})
    if not news:
        raise HTTPException(404, "News not found")

    news_collection.update_one(
        {"_id": obj_id},
        {
            "$pull": {
                "comments": {
                    "user": user["email"],
                    "text": data.text
                }
            }
        }
    )

    return {"message": "Comment deleted"}


# =========================================
# ================= ADMIN ==================
# =========================================

# ➕ CREATE NEWS
@router.post("/admin", dependencies=[Depends(admin_required)])
def add_news(
    title: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    image_url: str = Form(None),
    fontFamily: str = Form("sans-serif"),
    fontUrl: str = Form(""),
    textAlign: str = Form("left"),
    fontSize: int = Form(16),
    fontWeight: str = Form("normal"),
    color: str = Form("#ffffff"),
    user=Depends(admin_required)
):
    data = {
        "title": title,
        "content": content,
        "category": category,
        "image": image_url,
        "fontFamily": fontFamily,
        "fontUrl": fontUrl,
        "textAlign": textAlign,
        "fontSize": fontSize,
        "fontWeight": fontWeight,
        "color": color,
        "likes": 0,
        "dislikes": 0,
        "likedBy": [],
        "dislikedBy": [],
        "comments": [],
        "created_at": datetime.utcnow(),
        "created_by": user["email"]
    }

    result = news_collection.insert_one(data)
    return {"id": str(result.inserted_id)}


# ✏️ UPDATE NEWS
@router.put("/admin/{news_id}", dependencies=[Depends(admin_required)])
def update_news(
    news_id: str,
    title: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    image_url: str = Form(None),
    fontFamily: str = Form(None),
    fontUrl: str = Form(None),
    textAlign: str = Form(None),
    fontSize: int = Form(None),
    fontWeight: str = Form(None),
    color: str = Form(None),
    user=Depends(admin_required)
):
    obj_id = get_object_id(news_id)

    update_data = {
        "title": title,
        "content": content,
        "category": category,
        "image": image_url
    }

    # Only update font fields if provided
    if fontFamily: update_data["fontFamily"] = fontFamily
    if fontUrl: update_data["fontUrl"] = fontUrl
    if textAlign: update_data["textAlign"] = textAlign
    if fontSize: update_data["fontSize"] = fontSize
    if fontWeight: update_data["fontWeight"] = fontWeight
    if color: update_data["color"] = color

    result = news_collection.update_one(
        {"_id": obj_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(404, "News not found")

    return {"message": "Updated successfully"}


# ❌ DELETE NEWS
@router.delete("/admin/{news_id}", dependencies=[Depends(admin_required)])
def delete_news(
    news_id: str,
    user=Depends(admin_required)
):
    obj_id = get_object_id(news_id)

    result = news_collection.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        raise HTTPException(404, "News not found")

    return {"message": "Deleted successfully"}