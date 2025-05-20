// app/api/predict/route.js

import { NextResponse } from 'next/server';
import * as ort from 'onnxruntime-node'; // Use node version for API routes
import { createCanvas, loadImage } from 'canvas';

// Initialize ONNX runtime
ort.env.wasm.numThreads = 1;

export async function POST(req) {
  const { imageUrl } = await req.json();
  
  try {
    // 1. Load model (cached for multiple requests)
    if (!global.modelSession) {
      const modelUrl = "https://cuidgtbjhqojmcdvnyue.supabase.co/storage/v1/object/public/models/pneumonia_model.onnx";
      const response = await fetch(modelUrl);
      const buffer = await response.arrayBuffer();
      global.modelSession = await ort.InferenceSession.create(buffer);
    }

    // 2. Download and preprocess image
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    const img = await loadImage(Buffer.from(imageBuffer));
    
    const canvas = createCanvas(224, 224);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 224, 224);
    
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const pixels = new Float32Array(224 * 224 * 3);

    for (let i = 0; i < imageData.data.length; i += 4) {
      pixels[i/4] = imageData.data[i] / 255.0;     // R
      pixels[i/4 + 1] = imageData.data[i+1] / 255.0; // G 
      pixels[i/4 + 2] = imageData.data[i+2] / 255.0; // B
    }

    // 3. Run prediction
    const input = new ort.Tensor('float32', pixels, [1, 224, 224, 3]);
    const output = await global.modelSession.run({ input });
    const [normal, pneumonia, cancer] = output.output.data;

    // 4. Format results
    const diagnosis = [
      { class: 'Normal', probability: normal },
      { class: 'Pneumonia', probability: pneumonia },
      { class: 'Lung Cancer', probability: cancer }
    ].reduce((a, b) => a.probability > b.probability ? a : b);

    return NextResponse.json({
      diagnosis: diagnosis.class,
      confidence: diagnosis.probability,
      probabilities: { normal, pneumonia, cancer }
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}