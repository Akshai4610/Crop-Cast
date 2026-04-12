"""
Crop Model Schema
-----------------
Defines structure of crop data stored in MongoDB
"""

from pydantic import BaseModel

class CropDetails(BaseModel):
    crop_name: str
    growth_period: str
    climate: str
    soil: str
    water: str
    description: str
