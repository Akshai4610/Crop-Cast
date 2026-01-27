from fastapi import APIRouter
from app.schemas.crop_schema import CropInput, CropOutput
from app.services.prediction import predict_crop
from app.database.mongodb import predictions_collection

router = APIRouter(prefix="/api", tags=["Crop Recommendation"])

@router.post("/predict", response_model=CropOutput)
def recommend_crop(payload: CropInput):
    """
    API endpoint to recommend crop using ML mode
    """

    # Call ML prediction service
    predicted_crop, confidence = predict_crop(payload)

    # STORE PREDICTION HISTORY (DB)
    predictions_collection.insert_one({
        "inputs": payload.model_dump(),
        "predicted_crop": predicted_crop,
        "confidence": confidence
    })

    # API response
    return {
        "recommended_crop": predicted_crop,
        "confidence": round(confidence * 100, 2)
    }
