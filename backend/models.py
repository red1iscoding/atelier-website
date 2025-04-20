from pydantic import BaseModel
from typing import Optional

# Model for creating a new user
class UserCreate(BaseModel):
    full_name: str
    gender: str
    dob: str  # Date of birth (use datetime type if you want to enforce a date format)
    email: str
    phone: str
    password: str
    subscription_plan: str

# Model for logging in a user
class UserLogin(BaseModel):
    email: str
    password: str  

# Model for updating user information (partial update)
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None  # Optional, only update if provided
    phone: Optional[str] = None
    subscription_plan: Optional[str] = None  # Optional, can update if necessary
