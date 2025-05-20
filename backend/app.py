from flask import Flask, request, jsonify
from PIL import Image
import io
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# Load your Keras model once when starting the app
model = tf.keras.models.load_model(r"C:\Users\Informatics\Desktop\model.h5")

# Class labels for your 3 output neurons
class_labels = ['pneumonia', 'normal', 'lung_cancer']

def preprocess_image(image):
    # Resize image to 224x224 as per your model input
    img = image.resize((224, 224))
    img_array = np.array(img) / 255.0  # normalize pixel values to [0,1]
    
    # Make sure it has 3 channels (RGB)
    if img_array.shape[-1] != 3:
        img_array = np.stack((img_array,) * 3, axis=-1)
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    
    # Preprocess image for your model
    processed_img = preprocess_image(img)
    
    # Predict with your model
    preds = model.predict(processed_img)
    
    # Convert softmax output to class label and confidence
    pred_class_index = np.argmax(preds[0])
    diagnosis_type = class_labels[pred_class_index]
    confidence_score = float(preds[0][pred_class_index] * 100)
    
    result = {
        'diagnosis_type': diagnosis_type,
        'confidence_score': round(confidence_score, 2)
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
