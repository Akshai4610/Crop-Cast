"""
Crop Details API
----------------
Handles fetching and storing crop information
"""

from fastapi import APIRouter, HTTPException
from app.database.mongodb import crop_collection
from app.models.crop_model import CropDetails

router = APIRouter(prefix="/api/crop", tags=["Crop Details"])

# Get ALL crops (for admin table)
# GET /api/crop/all
@router.get("/all")
def get_all_crops():
    crops = list(crop_collection.find({}, {"_id": 0}))
    return crops

@router.get("/{crop_name}")
def get_crop_details(crop_name: str):
    """
    Fetch crop details by crop name
    """
    crop = crop_collection.find_one(
        {"crop_name": crop_name},
        {"_id": 0}  # hide MongoDB internal ID
    )

    if not crop:
        return {"exists": False}

    return {"exists": True, "data": crop}

# ✅ Add crop (admin)

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

    crop_collection.insert_one(crop.model_dump())
    return {"message": "Crop details added successfully"}


@router.delete("/{crop_name}")
def delete_crop(crop_name: str):
    """
    Delete crop details by crop name (Admin only - later)
    """
    result = crop_collection.delete_one({"crop_name": crop_name})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Crop not found"
        )

    return {"message": "Crop deleted successfully"}


@router.put("/{crop_name}")
def update_crop(crop_name: str, updated_data: dict):
    """
    Update crop details (partial update allowed)
    """
    crop_collection.update_one(
        {"crop_name": crop_name},
        {"$set": updated_data}
    )

    return {"message": "Crop updated successfully"}
