"""
predict_schema.py

PURPOSE:
- Define request and response models for prediction API
"""

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    city: str = Field(..., example="Kochi")


class PredictResponse(BaseModel):
    temperature: float
    humidity: float
    rainfall: float
    recommended_crop: str
