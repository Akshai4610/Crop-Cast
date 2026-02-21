# ===================================================
# Admin Crop CRUD Routes
# Only admin can add/edit/delete
# PyMongo SYNC version (NO async/await)
# ===================================================

# DELETE crop (by ObjectId)
from bson import ObjectId

from fastapi import APIRouter, HTTPException
from app.database.mongodb import crop_collection
from app.schemas.admin_crop_schema import CropCreate, CropUpdate

router = APIRouter(prefix="/admin/crops", tags=["Admin Crop"])


# ================================
# ADD crop
# ================================
@router.post("/")
def add_crop(crop: CropCreate):

    # prevent duplicate crop
    existing = crop_collection.find_one({"name": crop.name})
    if existing:
        raise HTTPException(status_code=400, detail="Crop already exists")

    crop_collection.insert_one(crop.model_dump())

    return {"message": "Crop added successfully"}


# ================================
# GET all crops
# ================================
@router.get("/")
def get_all_crops():

    # convert cursor → list (SYNC)
    crops = list(crop_collection.find())

    # convert ObjectId → string for frontend
    for c in crops:
        c["_id"] = str(c["_id"])

    return crops


# ================================
# UPDATE crop
# ================================
@router.put("/{id}")
def update_crop(id: str, crop: CropUpdate):

    try:
        result = crop_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": crop.model_dump(exclude_none=True)}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Crop not found")

        return {"message": "Crop updated successfully"}

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid crop id")


# ================================
# DELETE crop
# ================================
@router.delete("/{id}")
def delete_crop(id: str):

    """
    Delete crop using MongoDB _id
    Frontend sends _id → safest & industry standard
    """
    try:
        result = crop_collection.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Crop not found")

        return {"message": "Crop deleted successfully"}

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid crop id")
