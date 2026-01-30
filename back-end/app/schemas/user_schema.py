"""
User Schema
===========
Defines how user data looks in requests & responses
"""

from pydantic import BaseModel

class User(BaseModel):
    username: str
    role: str  # "admin" or "user"
