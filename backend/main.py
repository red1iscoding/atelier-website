from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from datetime import datetime, timedelta
import bcrypt
import jwt
import os
from dotenv import load_dotenv
from config import supabase
from models import UserCreate, UserLogin  # Ensure UserCreate includes the new fields

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow cross-origin requests
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


# Updated signup function with correct response handling
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


# User login route (returns JWT token)
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

# User info endpoint (protected)
@app.get("/user-info")
async def get_user_info(current_user: str = Depends(get_current_user)):
    try:
        response = supabase.table("users").select("*").eq("email", current_user).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error retrieving user data")
