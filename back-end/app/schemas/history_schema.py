"""
history_schema.py

PURPOSE:
- Validate history data from API requests
"""

from pydantic import BaseModel
from typing import List

class HistoryCreate(BaseModel):
    """
    Schema for storing prediction history
    """
    user_id: str
    location: str
    temperature: float
    humidity: float
    rainfall: float
    recommended_crop: str


class HistoryResponse(BaseModel):
    """
    Schema for returning history records
    """
    user_id: str
    location: str
    temperature: float
    humidity: float
    rainfall: float
    recommended_crop: str
