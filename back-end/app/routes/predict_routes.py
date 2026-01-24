from fastapi import APIRouter, HTTPException
from app.schemas.predict_schema import PredictRequest, PredictResponse
from app.services.weather_service import get_weather_by_city
from app.services.ml_service import predict_crop

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)


@router.post("/", response_model=PredictResponse)
async def predict_crop_api(request: PredictRequest):
    """
    Predict crop using real-time weather (no API key)
    """
    try:
        weather = get_weather_by_city(request.city)

        crop = predict_crop(
            temperature=weather["temperature"],
            humidity=weather["humidity"],
            rainfall=weather["rainfall"]
        )

        return {
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "rainfall": weather["rainfall"],
            "recommended_crop": crop
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
