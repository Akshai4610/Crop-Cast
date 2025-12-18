"""
user_schema.py

PURPOSE:
- Validate request & response data
- Prevent invalid data entering system
"""

from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    """
    Schema for creating a new user
    """
    name: str
    email: EmailStr
    location: Optional[str] = None


class UserUpdate(BaseModel):
    """
    Schema for updating user profile
    """
    name: Optional[str]
    location: Optional[str]
