"""
Crop Details API
----------------
Handles fetching and storing crop information
"""

from fastapi import APIRouter, HTTPException
from app.database.mongodb import crop_collection
from app.models.crop_model import CropDetails

router = APIRouter(prefix="/crop", tags=["Crop Details"])

# Get ALL crops (for admin table)
@router.get("/all")
def get_all_crops():
    crops = list(crop_collection.find({}, {"_id": 0}))
    return crops

@router.get("/{crop_name}")
def get_crop_details(crop_name: str):
    try:
        formatted = crop_name.strip().lower().replace(" ", "")

        crops = list(crop_collection.find({}, {"_id": 0}))

        for crop in crops:
            db_name = (
                crop.get("crop_name", "") or crop.get("name", "")
            ).strip().lower().replace(" ", "")

            # ✅ FIX: flexible matching
            if formatted in db_name or db_name in formatted:
                print(f"✅ Crop FOUND → {crop_name}")
                return {"exists": True, "data": crop}

        print(f"❌ Crop NOT FOUND → {crop_name}")
        return {"exists": False}

    except Exception as e:
        print("🔥 Crop fetch error:", e)
        return {"exists": False}
    
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
