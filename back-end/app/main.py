"""
main.py

PURPOSE:
- Entry point of FastAPI application
- Starts backend server
- Registers basic test route
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import get_database

from app.routes.user_routes import router as user_router
from app.routes.history_routes import router as history_router


# Create FastAPI app instance
app = FastAPI(
    title="Crop Cast API",
    description="Weather-Based Crop Recommendation System",
    version="1.0.0"
)

# CORS configuration
# This allows React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REGISTER ROUTERS HERE 
app.include_router(user_router)
app.include_router(history_router)


# Health check route (TEST)
@app.get("/db-test")
async def database_test():
    """
    Test MongoDB connection
    """
    db = get_database()
    collections = await db.list_collection_names()
    return {
        "status": "MongoDB connected",
        "collections": collections
    }

# Root test endpoint
@app.get("/")
async def root():
    """
    Root endpoint to verify backend is running
    """
    return {"message": "CropCast backend running"}