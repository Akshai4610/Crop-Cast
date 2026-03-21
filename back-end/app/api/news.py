"""
====================================================
📰 NEWS API (FINAL CLEAN ARCHITECTURE)
✔ Separate USER & ADMIN APIs
✔ Like/Dislike toggle
✔ Comments system
✔ Safe ObjectId
✔ Pagination ready
====================================================
"""

from fastapi import APIRouter, HTTPException, Form, Query, Body
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from app.database.mongodb import news_collection

router = APIRouter(prefix="/news", tags=["News"])


# =========================================
# 🔁 SERIALIZER
# =========================================
def serialize(news):
    news["_id"] = str(news["_id"])
    return news


# =========================================
# ================= USER ===================
# =========================================

# 📥 GET NEWS
@router.get("/")
def get_news(category: str = None, skip: int = 0, limit: int = 10):
    query = {"category": category} if category else {}

    data = news_collection.find(query)\
        .sort("created_at", -1)\
        .skip(skip)\
        .limit(limit)

    return [serialize(n) for n in data]


# 👍 LIKE
@router.post("/{news_id}/like")
def like_news(news_id: str, email: str = Form(...)):

    news = news_collection.find_one({"_id": ObjectId(news_id)})

    if not news:
        raise HTTPException(404, "News not found")

    liked = news.get("likedBy", [])
    disliked = news.get("dislikedBy", [])

    # UNLIKE
    if email in liked:
        news_collection.update_one(
            {"_id": ObjectId(news_id)},
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

        # remove dislike
        if email in disliked:
            update["$pull"] = {"dislikedBy": email}
            update["$inc"]["dislikes"] = -1

        news_collection.update_one({"_id": ObjectId(news_id)}, update)

    # ✅ RETURN UPDATED DATA
    updated = news_collection.find_one({"_id": ObjectId(news_id)})
    return serialize(updated)

# 👎 DISLIKE
@router.post("/{news_id}/dislike")
def dislike_news(news_id: str, email: str = Form(...)):

    news = news_collection.find_one({"_id": ObjectId(news_id)})

    if not news:
        raise HTTPException(404, "News not found")

    liked = news.get("likedBy", [])
    disliked = news.get("dislikedBy", [])

    # UNDISLIKE
    if email in disliked:
        news_collection.update_one(
            {"_id": ObjectId(news_id)},
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

        # remove like
        if email in liked:
            update["$pull"] = {"likedBy": email}
            update["$inc"]["likes"] = -1

        news_collection.update_one({"_id": ObjectId(news_id)}, update)

    # ✅ RETURN UPDATED DATA
    updated = news_collection.find_one({"_id": ObjectId(news_id)})
    return serialize(updated)

# 💬 ADD COMMENT
@router.post("/{news_id}/comments")
def add_comment(news_id: str, email: str = Form(...), text: str = Form(...)):
    comment = {
        "user": email,
        "text": text,
        "created_at": datetime.utcnow()
    }

    news_collection.update_one(
        {"_id": ObjectId(news_id)},
        {"$push": {"comments": comment}}
    )

    return {"message": "comment added"}


# 📥 GET COMMENTS
@router.get("/{news_id}/comments")
def get_comments(news_id: str):
    news = news_collection.find_one({"_id": ObjectId(news_id)})

    if not news:
        raise HTTPException(404, "Not found")

    return news.get("comments", [])

# ❌ DELETE COMMENTS
@router.delete("/{news_id}/comments")
def delete_comment(
    news_id: str,
    email: str = Body(...),
    text: str = Body(...)
):

    news = news_collection.find_one({"_id": ObjectId(news_id)})

    if not news:
        raise HTTPException(404, "News not found")

    news_collection.update_one(
        {"_id": ObjectId(news_id)},
        {
            "$pull": {
                "comments": {
                    "user": email,
                    "text": text
                }
            }
        }
    )

    return {"message": "comment deleted"}

# =========================================
# ================= ADMIN ==================
# =========================================

# ➕ CREATE
@router.post("/admin")
def add_news(
    title: str = Form(...),
    content: str = Form(...),
    category: str = Form(...),
    fontFamily: str = Form(""),
    fontUrl: str = Form(""),
    textAlign: str = Form("left"),
    fontSize: str = Form("16px"),
    fontWeight: str = Form("normal"),
    color: str = Form("#ffffff"),
    image_url: str = Form(None)
):
    data = {
        "title": title,
        "content": content,
        "category": category,
        "fontFamily": fontFamily,
        "fontUrl": fontUrl,
        "textAlign": textAlign,
        "fontSize": fontSize,
        "fontWeight": fontWeight,
        "color": color,
        "image": image_url,
        "likes": 0,
        "dislikes": 0,
        "likedBy": [],
        "dislikedBy": [],
        "comments": [],
        "created_at": datetime.utcnow()
    }

    result = news_collection.insert_one(data)
    return {"id": str(result.inserted_id)}


# ✏️ UPDATE
@router.put("/admin/{news_id}")
def update_news(news_id: str, title: str = Form(...), content: str = Form(...),
                category: str = Form(...), image_url: str = Form(None)):

    news_collection.update_one(
        {"_id": ObjectId(news_id)},
        {"$set": {
            "title": title,
            "content": content,
            "category": category,
            "image": image_url
        }}
    )

    return {"message": "updated"}


# ❌ DELETE
@router.delete("/admin/{news_id}")
def delete_news(news_id: str):
    news_collection.delete_one({"_id": ObjectId(news_id)})
    return {"message": "deleted"}