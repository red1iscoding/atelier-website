import * as ort from 'onnxruntime-web';

// Configure WASM paths
ort.env.wasm.wasmPaths = {
  'ort-wasm.wasm': '/wasm/ort-wasm.wasm',
  'ort-wasm-simd.wasm': '/wasm/ort-wasm-simd.wasm'
};

let modelSession = null;

export const initModel = async () => {
  if (!modelSession) {
    try {
      console.log("[Model] Initializing...");
      const modelUrl = "https://cuidgtbjhqojmcdvnyue.supabase.co/storage/v1/object/public/models/pneumonia_model.onnx";
      
      // Verify model URL is accessible
      const testResponse = await fetch(modelUrl, { method: 'HEAD' });
      if (!testResponse.ok) {
        throw new Error(`Model download failed (HTTP ${testResponse.status})`);
      }

      const response = await fetch(modelUrl);
      if (!response.ok) throw new Error(`Failed to fetch model: ${response.status}`);
      
      const modelBuffer = await response.arrayBuffer();
      modelSession = await ort.InferenceSession.create(modelBuffer);
      
      console.log("[Model] Loaded successfully");
      return modelSession;
    } catch (error) {
      console.error("[Model] Initialization failed:", error);
      throw new Error(`Model loading failed: ${error.message}`);
    }
  }
  return modelSession;
};

export const predictFromImage = async (imageUrl) => {
  try {
    // 1. Initialize model
    const session = await initModel();
    
    // 2. Verify image URL
    console.log("[Image] Verifying URL:", imageUrl);
    try {
      const testResponse = await fetch(imageUrl, { method: 'HEAD' });
      if (!testResponse.ok) {
        throw new Error(`Image inaccessible (HTTP ${testResponse.status})`);
      }
    } catch (fetchError) {
      throw new Error(`Image URL verification failed: ${fetchError.message}`);
    }

    // 3. Load image with CORS handling
    console.log("[Image] Loading...");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Image loading timed out (15s)"));
      }, 15000);

      img.onload = () => {
        clearTimeout(timeout);
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          reject(new Error("Loaded empty image"));
        } else {
          resolve();
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("Failed to load image (CORS or invalid URL)"));
      };
      
      img.src = `${imageUrl}?t=${Date.now()}`; // Cache buster
    });

    // 4. Preprocess image
    console.log("[Image] Preprocessing...");
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 224, 224);
    
    // 5. Create tensor
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const tensor = new Float32Array(224 * 224 * 3);

    for (let i = 0; i < imageData.data.length; i += 4) {
      tensor[i/4] = imageData.data[i]/255.0;     // R
      tensor[i/4+1] = imageData.data[i+1]/255.0; // G
      tensor[i/4+2] = imageData.data[i+2]/255.0; // B
    }

    // 6. Run prediction
    console.log("[Model] Running prediction...");
    const startTime = performance.now();
    const inputTensor = new ort.Tensor('float32', tensor, [1, 224, 224, 3]);
    const output = await session.run({ input: inputTensor });
    const [normal, pneumonia, cancer] = output.output.data;
    const inferenceTime = ((performance.now() - startTime)/1000).toFixed(2);

    // 7. Format results
    const diagnosis = pneumonia > 0.5 ? "Pneumonia" : "Normal";
    const confidence = Math.max(normal, pneumonia, cancer);
    
    console.log(`[Model] Prediction complete (${inferenceTime}s):`, { 
      diagnosis, 
      confidence,
      probabilities: { normal, pneumonia, cancer }
    });

    return { diagnosis, confidence };

  } catch (error) {
    console.error("[Prediction] Error:", {
      error: error.message,
      imageUrl
    });
    throw error;
  }
};

// Call this when your app loads
export const warmupModel = async () => {
  try {
    const session = await initModel();
    const dummyInput = new ort.Tensor('float32', new Float32Array(224*224*3).fill(0.5), [1,224,224,3]);
    await session.run({ input: dummyInput });
    console.log("[Model] Warmup complete");
  } catch (error) {
    console.error("[Model] Warmup failed:", error);
  }
};