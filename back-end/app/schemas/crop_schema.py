from pydantic import BaseModel, Field

class CropInput(BaseModel):
    """
    Input data required for crop prediction
    """
    N: float = Field(..., description="Nitrogen content")
    P: float = Field(..., description="Phosphorus content")
    K: float = Field(..., description="Potassium content")
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class CropOutput(BaseModel):
    """
    API response
    """
    recommended_crop: str
    confidence: float
