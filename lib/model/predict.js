import * as ort from 'onnxruntime-web';

// Initialize ONNX runtime
ort.env.wasm.wasmPaths = '/wasm/'; // Important for WASM files
ort.env.wasm.numThreads = 1;

const MODEL_URL = 'https://cuidgtbjhqojmcdvnyue.supabase.co/storage/v1/object/public/models/pneumonia_model.onnx';

export async function loadModel() {
  try {
    const session = await ort.InferenceSession.create(MODEL_URL);
    return session;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

export async function predict(session, imageElement) {
  try {
    // Preprocess the image
    const tensor = await preprocessImage(imageElement);
    
    // Run inference (adjust 'input_1' to match your model's input name)
    const results = await session.run({ input_1: tensor });
    
    // Process results (adjust based on your model's output)
    const output = results.output.data;
    const confidence = output[0]; // Assuming binary classification
    const diagnosis = confidence > 0.5 ? 'Pneumonia' : 'Normal';
    
    return { diagnosis, confidence };
  } catch (error) {
    console.error('Prediction failed:', error);
    throw error;
  }
}

async function preprocessImage(imgElement) {
  // Create canvas for resizing
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext('2d');
  
  // Draw and resize image
  ctx.drawImage(imgElement, 0, 0, 224, 224);
  
  // Get pixel data
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const data = imageData.data;
  
  // Normalize and convert to tensor
  const tensor = new Float32Array(224 * 224 * 3);
  for (let i = 0; i < data.length; i += 4) {
    tensor[i/4] = data[i]/255;     // R
    tensor[i/4 + 1] = data[i+1]/255; // G
    tensor[i/4 + 2] = data[i+2]/255; // B
  }
  
  return new ort.Tensor('float32', tensor, [1, 224, 224, 3]);
}