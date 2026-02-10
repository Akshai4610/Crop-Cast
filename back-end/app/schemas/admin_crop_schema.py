# =========================================
# Crop Schema for ADMIN CRUD
# Only structure definition (validation)
# =========================================

from pydantic import BaseModel
from typing import Optional


class CropCreate(BaseModel):
    name: str
    description: str
    growth_tips: str
    climate: str
    image_url: Optional[str] = None   # image path or url


class CropUpdate(BaseModel):
    description: Optional[str] = None
    growth_tips: Optional[str] = None
    climate: Optional[str] = None
    image_url: Optional[str] = None
