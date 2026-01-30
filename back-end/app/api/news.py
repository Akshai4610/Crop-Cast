"""
News API
========
Admin: add/edit/delete
User: read only
"""

from fastapi import APIRouter
from pydantic import BaseModel
from app.database.mongodb import news_collection

router = APIRouter(prefix="/api/news", tags=["News"])

class News(BaseModel):
    title: str
    content: str


@router.post("/")
def add_news(news: News):
    news_collection.insert_one(news.dict())
    return {"message": "News added"}


@router.get("/")
def get_news():
    return list(news_collection.find({}, {"_id": 0}))


@router.delete("/{title}")
def delete_news(title: str):
    news_collection.delete_one({"title": title})
    return {"message": "News deleted"}
