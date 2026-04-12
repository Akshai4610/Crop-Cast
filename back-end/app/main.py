"""
🚀 MAIN APPLICATION ENTRY
- Registers all routes
- Enables CORS
- Adds rate limiting (anti brute-force)
- Global error handling
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# 🔐 Rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
# ======================================================
# APP INIT
# ======================================================
app = FastAPI(
    title="Crop Cast API",
    description="Weather based crop recommendation system",
    version="2.0.0"
)

# ==============================
# 🔐 RATE LIMITER
# ==============================
limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# ==============================
# ❌ RATE LIMIT HANDLER
# ==============================
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."},
    )

# ======================================================
# CORS CONFIG
# ======================================================
load_dotenv()

origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# LICENSE ROUTER
# ======================================================

from app.api.license import router as license_router

app.include_router(license_router, prefix="/api")

# ======================================================
# ROUTERS
# ======================================================

from app.api.news import router as news_router
from app.api.auth import router as auth_router
from app.api.crop_routes import router as crop_router
from app.api.predictions import router as predictions_router
from app.api.profile import router as profile_router

from app.api.admin_crop import router as admin_crop_router
from app.api.admin_users import router as admin_users_router
from app.api.admin_dataset import router as admin_dataset_router
from app.api.crop_details import router as admin_crop_details_router
from app.api.admin_stats import router as admin_stats_router

app.include_router(auth_router, prefix="/api")
app.include_router(news_router, prefix="/api")
app.include_router(crop_router, prefix="/api")
app.include_router(predictions_router, prefix="/api")
app.include_router(profile_router, prefix="/api")

app.include_router(admin_crop_router, prefix="/api")
app.include_router(admin_dataset_router, prefix="/api")
app.include_router(admin_users_router, prefix="/api")
app.include_router(admin_crop_details_router, prefix="/api")
app.include_router(admin_stats_router, prefix="/api")

# ======================================================
# ROOT
# ======================================================
@app.get("/")
def root():
    return {"message": "Crop Cast Backend Running", "status": "OK"}

# ==============================
# ❤️ HEALTH CHECK
# ==============================
@app.get("/health")
def health():
    return {"status": "healthy"}