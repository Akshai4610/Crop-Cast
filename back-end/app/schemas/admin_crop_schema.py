# =========================================
# Crop Schema for ADMIN CRUD
# Only structure definition (validation)
# =========================================

from pydantic import BaseModel
from typing import Optional

class CropCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    growth_tips: Optional[str] = ""
    climate: Optional[str] = ""
    image_url: Optional[str] = ""   # image path or url

class CropUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    growth_tips: Optional[str] = None
    climate: Optional[str] = None
    image_url: Optional[str] = None