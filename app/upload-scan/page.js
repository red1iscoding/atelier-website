// app/upload-scan/page.js

'use client';  // Add this line at the top

import React, { useState } from 'react'; 
import Sidebar from "../../components/Sidebar"; 
import FileUpload from './components/FileUpload';  
import ScanDetailsForm from './components/ScanDetailsForm';  

const UploadScanPage = () => {
    const [uploadSuccess, setUploadSuccess] = useState(false);

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-semibold text-[#de0b0b] mb-4">Upload Your Scan</h1>
                <p className="text-lg text-gray-700 mb-8">Welcome to the TrustScan platform. Here you can easily upload your medical scans (X-ray) for fast and accurate AI-powered analysis. Our platform is designed to help healthcare providers quickly access scan results and make better-informed decisions.</p>

                {/* Instructions */}
                <p className="text-md text-gray-600 mb-8">Please follow the steps below to upload your scan and provide the necessary details for analysis. Once you upload the scan, you will be guided through submitting scan details to complete the process.</p>

                {/* File Upload and Scan Details Combined in One Card */}
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300">
                    <FileUpload onUploadSuccess={() => setUploadSuccess(true)} />
                    <ScanDetailsForm />
                </div>
            </div>
        </div>
    );
};

export default UploadScanPage;
