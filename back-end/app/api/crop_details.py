"""
Crop Details API
----------------
Handles fetching and storing crop information
"""

from fastapi import APIRouter, HTTPException, Depends
from app.database.mongodb import crop_collection
from app.models.crop_model import CropDetails

router = APIRouter(prefix="/api/crop", tags=["Crop Details"])

@router.get("/{crop_name}")
def get_crop_details(crop_name: str):
    """
    Fetch crop details by crop name
    """
    crop = crop_collection.find_one(
        {"crop_name": crop_name},
        {"_id": 0}
    )

    if not crop:
        return {"exists": False}

    return {"exists": True, "data": crop}


@router.post("/add")
def add_crop_details(crop: CropDetails):
    """
    Add new crop details to database
    """
    existing = crop_collection.find_one(
        {"crop_name": crop.crop_name}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Crop details already exist"
        )

    crop_collection.insert_one(crop.dict())
    return {"message": "Crop details added successfully"}

# Example for DELETE (admin only check later)
@router.delete("/{crop_name}")
def delete_crop(crop_name: str):
    result = crop_collection.delete_one({"crop_name": crop_name})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Crop not found")
    return {"message": "Crop deleted successfully"}