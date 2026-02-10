# ===================================================
# Admin Crop CRUD Routes
# Only admin can add/edit/delete
# PyMongo SYNC version (NO async/await)
# ===================================================

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

    crop_collection.insert_one(crop.dict())

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
@router.put("/{name}")
def update_crop(name: str, crop: CropUpdate):

    result = crop_collection.update_one(
        {"name": name},
        {"$set": crop.model_dump(exclude_none=True)}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Crop not found")

    return {"message": "Crop updated successfully"}


# ================================
# DELETE crop
# ================================
@router.delete("/{name}")
def delete_crop(name: str):

    result = crop_collection.delete_one({"name": name})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Crop not found")

    return {"message": "Crop deleted"}
