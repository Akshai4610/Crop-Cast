"""
main.py

PURPOSE:
- Entry point of FastAPI application
- Starts backend server
- Registers basic test route
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# Health check route (TEST)
@app.get("/")
def root():
    return {"message": "Crop Cast backend is running"}
