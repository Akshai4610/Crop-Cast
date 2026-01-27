from fastapi import APIRouter, HTTPException
from app.database.mongodb import news_collection
from pydantic import BaseModel

router = APIRouter(prefix="/api/news", tags=["News"])

class NewsItem(BaseModel):
    title: str
    content: str

@router.post("/add")
def add_news(news: NewsItem):
    news_collection.insert_one(news.dict())
    return {"message": "News added"}

@router.get("/")
def get_news():
    news = list(news_collection.find({}, {"_id":0}))
    return {"news": news}
