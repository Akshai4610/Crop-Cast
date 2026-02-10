# ==================================================
# Dataset manager for ML
# Admin adds training rows dynamically
# ==================================================

from fastapi import APIRouter
from app.database.mongodb import db

router = APIRouter(prefix="/admin/dataset", tags=["Admin Dataset"])


@router.post("/")
async def add_row(row: dict):

    # prevent duplicates
    exists = await db.dataset.find_one(row)
    if exists:
        return {"message": "Row already exists"}

    await db.dataset.insert_one(row)

    return {"message": "Row added"}


@router.get("/")
async def get_rows():
    rows = await db.dataset.find().to_list(500)
    for r in rows:
        r["_id"] = str(r["_id"])
    return rows
