from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ======================================================
# APP INIT
# ======================================================
app = FastAPI(
    title="Crop Cast API",
    description="Weather based crop recommendation system",
    version="1.0.0"
)

# ======================================================
# CORS CONFIG
# ======================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# ROUTERS
# ======================================================
from app.api.news import router as news_router
from app.api.auth import router as auth_router
from app.api.crop_routes import router as crop_router
from app.api.predictions import router as predictions_router

from app.api.admin_crop import router as admin_crop_router
from app.api.admin_dataset import router as admin_dataset_router
from app.api.admin_users import router as admin_users_router

app.include_router(auth_router, prefix="/api")
app.include_router(news_router, prefix="/api")
app.include_router(crop_router, prefix="/api")
app.include_router(predictions_router, prefix="/api")

app.include_router(admin_crop_router, prefix="/api")
app.include_router(admin_dataset_router, prefix="/api")
app.include_router(admin_users_router, prefix="/api")

# ======================================================
# ROOT
# ======================================================
@app.get("/")
def root():
    return {"status": "Crop Cast Backend Running"}