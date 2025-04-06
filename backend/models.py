from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    full_name: str
    gender: str
    dob: str  # Store as string in format "YYYY-MM-DD" (can also use `date` type)
    email: str
    phone: Optional[str] = None  # Optional field
    password: str
    subscription_plan: str  # You can store subscription plan

class UserLogin(BaseModel):
    email: str
    password: str
