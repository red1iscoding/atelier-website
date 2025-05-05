import * as ort from 'onnxruntime-web';

// Configure ONNX Runtime
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;

// WASM file paths
ort.env.wasm.wasmPaths = {
  'ort-wasm.wasm': '/wasm/ort-wasm.wasm',
  'ort-wasm-simd.wasm': '/wasm/ort-wasm-simd.wasm'
};

// Float16 conversion
function toFloat16(val) {
  const buf = new ArrayBuffer(4);
  const view = new DataView(buf);
  view.setFloat32(0, val, true);
  return (view.getUint32(0, true) >> 16) & 0xFFFF;
}

// Model loading function
export const loadModel = async () => {
  try {
    const modelUrl = "https://cuidgtbjhqojmcdvnyue.supabase.co/storage/v1/object/public/models/pneumonia_model.onnx";
    const response = await fetch(modelUrl);
    const modelBuffer = await response.arrayBuffer();
    const session = await ort.InferenceSession.create(modelBuffer);
    
    // Debug: Verify model input/output names
    console.log("Model inputs:", session.inputNames);
    console.log("Model outputs:", session.outputNames);
    
    return session;
  } catch (error) {
    console.error("Model loading failed:", error);
    throw error;
  }
};

// Image preprocessing (unchanged)
export const preprocessImage = (imageElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = 224;
  canvas.height = 224;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, 224, 224);

  const imageData = ctx.getImageData(0, 0, 224, 224);
  const tensor = new Uint16Array(224 * 224 * 3);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i] / 255.0;
    const g = imageData.data[i + 1] / 255.0;
    const b = imageData.data[i + 2] / 255.0;
    
    tensor[i / 4] = toFloat16(r);
    tensor[i / 4 + 1] = toFloat16(g);
    tensor[i / 4 + 2] = toFloat16(b);
  }

  return {
    data: tensor,
    dims: [1, 224, 224, 3]
  };
};

// Updated prediction function
export const predict = async (session, imageElement) => {
  try {
    const { data, dims } = preprocessImage(imageElement);
    const inputTensor = new ort.Tensor('float16', data, dims);
    const output = await session.run({ 
      [session.inputNames[0]]: inputTensor
    });

    // Safely extract output data
    const outputKey = session.outputNames[0];
    if (!output[outputKey]) {
      throw new Error("Model output format unexpected");
    }

    const outputData = Array.from(output[outputKey].data);
    
    // Validate output structure
    if (outputData.length !== 3) {
      throw new Error(`Expected 3 output values, got ${outputData.length}`);
    }

    const [normal = 0, pneumonia = 0, cancer = 0] = outputData;
    
    return {
      diagnosis: "",
      confidence: 0,
      probabilities: { normal, pneumonia, cancer },
      isValid: true
    };
  } catch (error) {
    console.error("Prediction failed:", error);
    return { 
      diagnosis: "Error", 
      confidence: 0,
      probabilities: { normal: 0, pneumonia: 0, cancer: 0 },
      isValid: false,
      error: error.message
    };
  }
};