from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware  # CORS middleware
from datetime import datetime, timedelta
import bcrypt
import jwt
import os
from dotenv import load_dotenv
from config import supabase
from models import UserCreate, UserLogin, UserUpdate  # Ensure these models exist

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use specific origins in production for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define OAuth2 scheme for JWT token authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Retrieve the secret key from .env
SECRET_KEY = os.getenv("SECRET_KEY")

# Dependency to decode the JWT token and extract the current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Function to check admin role
def is_admin(current_user: str = Depends(get_current_user)):
    user_data = supabase.table("users").select("role").eq("email", current_user).execute()
    if user_data.error or user_data.data[0]['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# User signup
@app.post("/signup")
async def signup(user: UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        # Insert user data into Supabase (Database)
        response = supabase.table("users").insert({
            "email": user.email,
            "password": hashed_password.decode('utf-8'),
            "full_name": user.full_name,
            "gender": user.gender,
            "date_of_birth": user.dob,
            "phone_number": user.phone,
            "role": "user",  # Default role
            "status": "active",  # Default status
        }).execute()

        if response.error:  # Check for errors in the response
            raise HTTPException(status_code=400, detail=f"Failed to create user: {response.error_message}")
        
        return {"message": "User created successfully."}
    
    except Exception as e:
        print(f"Error: {e}")  # Log the exact error message
        raise HTTPException(status_code=400, detail=f"User creation failed: {str(e)}")

# User login
@app.post("/login")
async def login(user: UserLogin):
    response = supabase.table("users").select("*").eq("email", user.email).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    stored_user = response.data[0]
    if not bcrypt.checkpw(user.password.encode('utf-8'), stored_user['password'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    expiration = datetime.utcnow() + timedelta(hours=1)
    token = jwt.encode({"sub": user.email, "exp": expiration}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

# Get user info (protected route)
@app.get("/user-info")
async def get_user_info(current_user: str = Depends(get_current_user)):
    try:
        response = supabase.table("users").select("*").eq("email", current_user).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error retrieving user data")

# Admin - Update user info (admin side)
@app.put("/admin/user/{user_id}")
async def update_user(user_id: int, user_update: UserUpdate, current_user: str = Depends(is_admin)):
    response = supabase.table("users").select("*").eq("user_id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    updated_data = {
        "full_name": user_update.full_name,
        "gender": user_update.gender,
        "date_of_birth": user_update.dob,
        "phone_number": user_update.phone,
    }

    # Update user data in database
    update_response = supabase.table("users").update(updated_data).eq("user_id", user_id).execute()
    if update_response.error:
        raise HTTPException(status_code=400, detail="Failed to update user info")

    return {"message": "User info updated successfully."}

# Admin - Create consultation (appointment)
@app.post("/admin/consultations")
async def create_appointment(consultation_data: dict, current_user: str = Depends(is_admin)):
    response = supabase.table("consultations").insert(consultation_data).execute()

    if response.error:
        raise HTTPException(status_code=400, detail="Failed to create consultation")

    return {"message": "Consultation created successfully."}

# Admin - Manage scans (add or update scans)
@app.post("/admin/scans")
async def add_scan(scan_data: dict, current_user: str = Depends(is_admin)):
    response = supabase.table("scans").insert(scan_data).execute()

    if response.error:
        raise HTTPException(status_code=400, detail="Failed to add scan")

    return {"message": "Scan added successfully."}

# Admin - Update scan data
@app.put("/admin/scans/{scan_id}")
async def update_scan(scan_id: int, scan_data: dict, current_user: str = Depends(is_admin)):
    response = supabase.table("scans").update(scan_data).eq("scan_id", scan_id).execute()

    if response.error:
        raise HTTPException(status_code=400, detail="Failed to update scan")

    return {"message": "Scan updated successfully."}

# Admin - Get all users (for admin dashboard)
@app.get("/admin/users")
async def get_users(current_user: str = Depends(is_admin)):
    response = supabase.table("users").select("*").execute()
    if response.error:
        raise HTTPException(status_code=400, detail="Failed to retrieve users")

    return {"users": response.data}

# Admin - Get consultations
@app.get("/admin/consultations")
async def get_consultations(current_user: str = Depends(is_admin)):
    response = supabase.table("consultations").select("*").execute()
    if response.error:
        raise HTTPException(status_code=400, detail="Failed to retrieve consultations")

    return {"consultations": response.data}

# Admin - Get scans
@app.get("/admin/scans")
async def get_scans(current_user: str = Depends(is_admin)):
    response = supabase.table("scans").select("*").execute()
    if response.error:
        raise HTTPException(status_code=400, detail="Failed to retrieve scans")

    return {"scans": response.data}
