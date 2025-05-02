from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Test the connection
try:
    response = supabase.table("users").select("*").execute()
    print(response.data)  # This should print out the existing users if the connection is good
except Exception as e:
    print("Error: ", e)
