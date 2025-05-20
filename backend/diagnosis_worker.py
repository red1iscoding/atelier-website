import time
import io
import numpy as np
from PIL import Image
import tensorflow as tf
from supabase import create_client, Client
import requests

# === CONFIGURATION ===
SUPABASE_URL = "https://cuidgtbjhqojmcdvnyue.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWRndGJqaHFvam1jZHZueXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDIwNzcsImV4cCI6MjA1NzAxODA3N30.qkFh0yV9FHd20xnFsqs6E6KuoLemiKCDjMHWmYvD0kM"

BUCKET_NAME = "medical-scans"
PENDING_STATUS = "pending"
COMPLETED_STATUS = "completed"
FAILED_STATUS = "failed"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load your trained model
MODEL_PATH = r"C:\Users\Informatics\Desktop\model.h5"
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully")

CLASS_LABELS = ['pneumonia', 'normal', 'lung_cancer']

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model prediction"""
    img = image.resize((224, 224))
    img_array = np.array(img) / 255.0
    
    # Ensure 3 channels (RGB)
    if len(img_array.shape) == 2 or img_array.shape[-1] == 1:
        img_array = np.stack((img_array,) * 3, axis=-1)
    elif img_array.shape[-1] == 4:  # RGBA case
        img_array = img_array[..., :3]
    
    return np.expand_dims(img_array, axis=0)

def download_scan_file(file_path: str) -> Image.Image:
    """Download scan file from Supabase Storage"""
    try:
        # Get signed URL response
        signed_url_response = supabase.storage.from_(BUCKET_NAME).create_signed_url(file_path, 1800)
        
        # Extract the URL from the response
        signed_url = signed_url_response.get('signedURL') or signed_url_response.get('signedUrl')
        if not signed_url:
            raise Exception("No valid signed URL found in response")
        
        # Download the image
        response = requests.get(signed_url, timeout=15)
        response.raise_for_status()
        
        return Image.open(io.BytesIO(response.content)).convert('RGB')
        
    except Exception as e:
        print(f"Failed to download file {file_path}: {str(e)}")
        raise

def update_scan_record(scan_id: str, updates: dict):
    """Update scan record in database"""
    supabase.table("scans").update(updates).eq("scan_id", scan_id).execute()

def diagnose_scan(scan_id: str, file_path: str):
    """Process a single scan through the diagnosis pipeline"""
    print(f"Diagnosing scan {scan_id}...")
    try:
        img = download_scan_file(file_path)
        input_array = preprocess_image(img)
        preds = model.predict(input_array)
        pred_index = np.argmax(preds[0])
        
        update_scan_record(scan_id, {
            "diagnosis_type": CLASS_LABELS[pred_index],
            "confidence_score": float(preds[0][pred_index] * 100),
            "diagnosis_status": COMPLETED_STATUS
        })
        print(f"Completed diagnosis for scan {scan_id}")
        
    except Exception as e:
        print(f"Failed to diagnose scan {scan_id}: {str(e)}")
        update_scan_record(scan_id, {"diagnosis_status": FAILED_STATUS})

def run_worker(poll_interval=60):
    """Main worker loop"""
    print("Diagnosis worker running...")
    while True:
        try:
            # Get pending scans
            response = supabase.from_("scans").select(
                "scan_id,file_path"
            ).eq("diagnosis_status", PENDING_STATUS).execute()
            
            scans = response.data if response.data else []
            print(f"Found {len(scans)} scans to process")
            
            for scan in scans:
                diagnose_scan(scan["scan_id"], scan["file_path"])
                
        except Exception as e:
            print(f"Worker error: {str(e)}")
        
        time.sleep(poll_interval)

if __name__ == "__main__":
    run_worker()