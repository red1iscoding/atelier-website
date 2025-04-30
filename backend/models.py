
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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



class ConsultationCreate(BaseModel):
    patient_id: int
    doctor_id: int
    consultation_date: str  # Change 'date' to 'consultation_date'
    consultation_time: str  # Change 'time' to 'consultation_time'
    consultation_type: str
    facility: str
    status: str
    payment_status: str
    full_price: float
    upfront_payment: float
    notes: str
    reminder_time: str
    created_at: str
    updated_at: str

