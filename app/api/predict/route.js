// app/api/predict/route.js
import { NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs-node';

export async function POST(req) {
  const { imageData } = await req.json(); // Array of 224x224x3 values
  
  try {
    // 1. Load Model
    const model = await tf.loadLayersModel('file://./public/model/model.json');
    
    // 2. Create Tensor (match your model's input shape)
    const tensor = tf.tensor4d([imageData], [1, 224, 224, 3]);
    
    // 3. Predict
    const prediction = model.predict(tensor);
    const results = Array.from(prediction.dataSync());
    
    // 4. Map to class names
    const classes = [
      'Normal', 
      'Bacterial Pneumonia',
      'Viral Pneumonia'
    ];
    
    return NextResponse.json({
      predictions: classes.map((name, index) => ({
        className: name,
        probability: Math.round(results[index] * 100)
      }))
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Prediction failed: " + error.message },
      { status: 500 }
    );
  }
}