from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import bcrypt
import jwt
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
from backend._DEPRECATED_config import supabase
import logging

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme for JWT
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = os.getenv("SECRET_KEY")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ====== MODELS ======
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    gender: str
    dob: str
    phone: str
    subscription_plan: str = "basic"
    payment_status: str = "pending"
    unlimited_scans: bool = False

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    full_name: str
    gender: str
    dob: str
    phone: str

class PaymentDetails(BaseModel):
    method: str  # "dahabiya" or "paypal"
    card_number: Optional[str] = None
    expiry: Optional[str] = None
    cvv: Optional[str] = None
    paypal_email: Optional[str] = None

class AppointmentWithPayment(BaseModel):
    appointment_type: str
    facility: str
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None
    full_price: float
    upfront_payment: float
    facility_address: Optional[str] = None
    facility_image: Optional[str] = None
    payment: PaymentDetails

# ====== AUTH HELPERS ======
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def is_admin(current_user: str = Depends(get_current_user)):
    user = supabase.table("users").select("role").eq("email", current_user).execute().data[0]
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# ====== AUTH ROUTES ======
@app.post("/signup")
async def signup(user: UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    try:
        response = supabase.table("users").insert({
            "email": user.email,
            "password": hashed_password.decode('utf-8'),
            "full_name": user.full_name,
            "gender": user.gender,
            "date_of_birth": user.dob,
            "phone_number": user.phone,
            "role": "patient",
            "status": "active",
            "subscription_plan": user.subscription_plan,
            "payment_status": user.payment_status,
            "unlimited_scans": user.unlimited_scans
        }).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="User creation failed")
        
        return {
            "message": "User created successfully",
            "user_id": response.data[0]['user_id']
        }
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"User creation failed: {str(e)}")

@app.post("/login")
async def login(user: UserLogin):
    response = supabase.table("users").select("*").eq("email", user.email).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    stored_user = response.data[0]
    if not bcrypt.checkpw(user.password.encode('utf-8'), stored_user['password'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt.encode(
        {"sub": user.email, "exp": datetime.utcnow() + timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )
    return {"access_token": token, "token_type": "bearer"}

@app.get("/user-info")
async def get_user_info(current_user: str = Depends(get_current_user)):
    try:
        user = supabase.table("users").select("*").eq("email", current_user).execute().data[0]
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ====== APPOINTMENT ROUTES ======
@app.post("/appointments")
async def create_appointment(
    appointment: AppointmentWithPayment, 
    current_user: str = Depends(get_current_user)
):
    try:
        # Get user ID
        user = supabase.table("users").select("user_id").eq("email", current_user).execute().data[0]
        
        # Process payment (mock)
        payment_status = "paid"  # In real app, verify with payment gateway
        
        # Create appointment
        appointment_data = {
            "user_id": user["user_id"],
            "appointment_type": appointment.appointment_type,
            "facility": appointment.facility,
            "appointment_date": appointment.appointment_date,
            "appointment_time": appointment.appointment_time,
            "notes": appointment.notes,
            "status": "confirmed",
            "payment_status": payment_status,
            "appointment_full_price": appointment.full_price,
            "appointment_upfront_payment": appointment.upfront_payment,
            "appointment_facility_address": appointment.facility_address,
            "appointment_facility_image": appointment.facility_image,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("appointments").insert(appointment_data).execute()
        
        return {
            "message": "Appointment created successfully",
            "appointment_id": response.data[0]["consultation_id"],
            "payment_status": payment_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/appointments/{appointment_id}")
async def get_appointment(
    appointment_id: int,
    current_user: str = Depends(get_current_user)
):
    try:
        user = supabase.table("users").select("user_id").eq("email", current_user).execute().data[0]
        response = supabase.table("appointments")\
            .select("*")\
            .eq("consultation_id", appointment_id)\
            .eq("user_id", user["user_id"])\
            .execute()
            
        if not response.data:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/appointments/{appointment_id}/cancel")
async def cancel_appointment(
    appointment_id: int,
    current_user: str = Depends(get_current_user)
):
    try:
        user = supabase.table("users").select("user_id").eq("email", current_user).execute().data[0]
        
        # Verify appointment belongs to user
        appointment = supabase.table("appointments")\
            .select("*")\
            .eq("consultation_id", appointment_id)\
            .eq("user_id", user["user_id"])\
            .execute()
            
        if not appointment.data:
            raise HTTPException(status_code=404, detail="Appointment not found")
            
        supabase.table("appointments")\
            .update({"status": "cancelled"})\
            .eq("consultation_id", appointment_id)\
            .execute()
            
        return {"message": "Appointment cancelled"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ====== SCAN ROUTES ======
@app.post("/scans")
async def upload_scan(
    file: UploadFile = File(...),
    scan_type: str = Form(...),
    current_user: str = Depends(get_current_user)
):
    try:
        user = supabase.table("users").select("user_id").eq("email", current_user).execute().data[0]
        
        # Store file in Supabase Storage
        file_content = await file.read()
        file_path = f"scans/{user['user_id']}/{datetime.now().timestamp()}_{file.filename}"
        
        supabase.storage().from_("scans").upload(file_path, file_content)
        
        # Store metadata
        scan_data = {
            "user_id": user["user_id"],
            "scan_type": scan_type,
            "file_path": file_path,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("scans").insert(scan_data).execute()
        
        return {
            "message": "Scan uploaded successfully",
            "scan_id": response.data[0]["scan_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patient/scans")
async def get_patient_scans(current_user: str = Depends(get_current_user)):
    try:
        user = supabase.table("users").select("user_id").eq("email", current_user).execute().data[0]
        scans = supabase.table("scans")\
            .select("*")\
            .eq("user_id", user["user_id"])\
            .execute()
            
        return {"scans": scans.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ====== ADMIN ROUTES ======
@app.get("/admin/users")
async def get_users(current_user: str = Depends(is_admin)):
    try:
        users = supabase.table("users").select("*").execute()
        return {"users": users.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/user/{user_id}")
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: str = Depends(is_admin)
):
    try:
        supabase.table("users")\
            .update({
                "full_name": user_update.full_name,
                "gender": user_update.gender,
                "date_of_birth": user_update.dob,
                "phone_number": user_update.phone
            })\
            .eq("user_id", user_id)\
            .execute()
            
        return {"message": "User updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/user/{user_id}")
async def delete_user(
    user_id: int,
    current_user: str = Depends(is_admin)
):
    try:
        supabase.table("users").delete().eq("user_id", user_id).execute()
        return {"message": "User deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/appointments")
async def get_all_appointments(current_user: str = Depends(is_admin)):
    try:
        appointments = supabase.table("appointments").select("*").execute()
        return {"appointments": appointments.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/scans")
async def get_all_scans(current_user: str = Depends(is_admin)):
    try:
        scans = supabase.table("scans").select("*").execute()
        return {"scans": scans.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))