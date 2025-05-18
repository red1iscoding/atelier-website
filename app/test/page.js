// app/test/page.js
'use client';
import { useState } from 'react';

export default function TestPage() {
  const [predictions, setPredictions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setPredictions([]);
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      // 1. Load and resize image
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = () => {
        // 2. Create canvas to process image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set to your model's input size
        canvas.width = 224;
        canvas.height = 224;
        
        // 3. Draw and process image
        ctx.drawImage(img, 0, 0, 224, 224);
        const imageData = ctx.getImageData(0, 0, 224, 224);
        
        // 4. Convert to array and normalize
        const pixels = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
          pixels.push(imageData.data[i] / 255);   // R
          pixels.push(imageData.data[i+1] / 255); // G
          pixels.push(imageData.data[i+2] / 255); // B
        }

        // 5. Send to API
        fetch('/api/predict', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ imageData: pixels })
        })
        .then(res => res.json())
        .then(data => {
          setPredictions(data.predictions);
          setSelectedImage(e.target.result);
        })
        .finally(() => setLoading(false));
      };
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Pneumonia Detection Test</h1>
      
      {/* File Upload */}
      <div className="mb-8">
        <label className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600">
          Upload Chest X-Ray
          <input 
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Preview and Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Preview */}
        {selectedImage && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">X-Ray Preview</h2>
            <img 
              src={selectedImage} 
              alt="X-Ray Preview" 
              className="w-full h-64 object-contain border-2 border-gray-200 rounded"
            />
          </div>
        )}

        {/* Results */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing image...</p>
            </div>
          ) : predictions.length > 0 ? (
            <div className="space-y-4">
              {predictions.map((pred, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{pred.className}</span>
                    <span className="text-blue-600">{pred.probability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2" 
                      style={{ width: `${pred.probability}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Upload an X-ray image to get results
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-700">
        Note: This is a university project demo. Results are not medical diagnoses.
      </div>
    </div>
  );
}