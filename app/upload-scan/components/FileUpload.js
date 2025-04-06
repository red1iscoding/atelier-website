// app/upload-scan/components/FileUpload.js

'use client';  // Add this line at the top

import React, { useState } from 'react';

const FileUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 20 * 1024 * 1024) { // 20MB limit
            setSelectedFile(file);
            setError("");
        } else {
            setError("File size must be less than 20MB.");
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            setTimeout(() => {
                onUploadSuccess(); // Trigger success callback
            }, 2000);
        } else {
            setError("Please select a valid file.");
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[#de0b0b] mb-4">Select Your Scan</h3>
            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#de0b0b] w-full"
            />
            {selectedFile && (
                <div className="mt-2 text-lg text-gray-700">
                    <p>File selected: <strong>{selectedFile.name}</strong></p>
                    <p className="text-sm text-gray-500">Size: {Math.round(selectedFile.size / 1024)} KB</p>
                </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
                onClick={handleUpload}
                className="mt-4 w-full py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition duration-200"
            >
                Upload Scan
            </button>
        </div>
    );
};

export default FileUpload;
