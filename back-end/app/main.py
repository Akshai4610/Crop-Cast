from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Crop Cast API",
    description="Weather based crop recommendation system",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
        "http://127.0.0.1:5173"
        ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE
    allow_headers=["*"],  # Authorization, Content-Type, etc
)

# ==============================
# ROUTERS
# ==============================
from app.api.crop_routes import router as crop_router
from app.api.crop_routes import router as crop_details_router
from app.api.predictions import router as predict_router
from app.api.auth import router as auth_router
from app.api.predictions import router as history_router
from app.api.news import router as news_router

# Register routes
app.include_router(crop_router)
app.include_router(crop_details_router)
app.include_router(predict_router)
app.include_router(auth_router)
app.include_router(history_router)
app.include_router(news_router)

@app.get("/")
def root():
    return {"status": "Crop Cast Backend Running"}
