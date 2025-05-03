
'use client';

import { useState } from 'react';
import { loadModel, predict } from '../../lib/model/predict.js';

export default function TestModel() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      // 1. Load the model
      const session = await loadModel();

      // 2. Create an image element from the uploaded file
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(file);
      await new Promise((resolve) => { imageElement.onload = resolve; });

      // 3. Run prediction
      const { diagnosis, confidence } = await predict(session, imageElement);
      setResult({ diagnosis, confidence });
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Test Pneumonia Model</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="image/png,image/jpeg" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Test"}
        </button>
      </form>

      {result && (
        <div>
          <h2>Result</h2>
          <p>Diagnosis: <strong>{result.diagnosis}</strong></p>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}