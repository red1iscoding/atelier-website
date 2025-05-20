'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Sidebar from "../../components/Sidebar";
import { useRouter } from 'next/navigation';

const UploadScanPage = () => {
    const [file, setFile] = useState(null);
    const [scanType, setScanType] = useState('xray');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const router = useRouter();

    // Check authentication using your existing system
    useEffect(() => {
        const checkAuth = () => {
            // Get user_id from your session storage
            const userId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
            
            if (!userId) {
                router.push('/login');
                return;
            }
            
            setCurrentUserId(userId);
        };

        checkAuth();
    }, [router]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Basic validation
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Only JPG, PNG, or PDF files allowed');
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUserId) {
            setError('Authentication required');
            return;
        }

        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
            const filePath = `user-uploads/${currentUserId}/${fileName}`;

            // Upload to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from('medical-scans')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Create record in scans table
            const { error: dbError } = await supabase
                .from('scans')
                .insert([{
                    user_id: currentUserId, // Using your existing user_id system
                    scan_type: scanType,
                    file_name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    diagnosis_status: 'pending',
                    status: 'pending_review',
                    created_at: new Date().toISOString()
                }]);

            if (dbError) throw dbError;

            setSuccessMessage('Scan uploaded successfully!');
            setFile(null);
            
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    if (!currentUserId) {
        return (
            <div className="flex min-h-screen bg-white">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 text-center">
                        <h2 className="text-2xl font-semibold text-[#003366] mb-4">
                            Authentication Required
                        </h2>
                        <p className="mb-6">Please log in to upload scans.</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-3 bg-[#003366] text-white rounded-md hover:bg-[#002244]"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-semibold text-[#003366] mb-4">Upload Your Scan</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Welcome to the TrustScan platform. Upload your medical scans for analysis by our certified radiologists.
                    Get accurate results within 24 hours for most common scan types.
                </p>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-[#003366] mb-4">1. Select Scan File</h2>
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                            }`}>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    id="scan-upload"
                                    required
                                />
                                <label
                                    htmlFor="scan-upload"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    <svg
                                        className={`w-12 h-12 mb-2 ${
                                            file ? 'text-green-500' : 'text-gray-400'
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className={`text-lg ${
                                        file ? 'text-green-700 font-medium' : 'text-gray-600'
                                    }`}>
                                        {file ? (
                                            <>
                                                <span className="font-semibold">{file.name}</span>
                                                <span className="block text-sm text-green-600 mt-1">Ready to upload</span>
                                            </>
                                        ) : 'Click to browse or drag and drop your scan file'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Supported formats: JPG, PNG, PDF (Max 50MB)
                                    </p>
                                </label>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-[#003366] mb-4">2. Scan Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Scan Type
                                    </label>
                                    <select
                                        value={scanType}
                                        onChange={(e) => setScanType(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003366] focus:border-[#003366]"
                                        required
                                    >
                                        <option value="xray">X-Ray</option>
                                        <option value="mri">MRI</option>
                                        <option value="ct">CT Scan</option>
                                        <option value="ultrasound">Ultrasound</option>
                                        <option value="mammogram">Mammogram</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003366] focus:border-[#003366] min-h-[100px]"
                                        placeholder="Any additional information about this scan..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading || !file}
                                className={`px-6 py-3 rounded-md text-white font-medium ${
                                    loading || !file
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#003366] hover:bg-[#002244]'
                                } transition-colors duration-300 flex items-center justify-center min-w-[150px]`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload Scan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-sm text-gray-600 border-t pt-4">
                    <p>Need help? Contact our support team at support@trustscan.example.com</p>
                    <p className="mt-2">Your privacy is important to us. All scans are encrypted and processed in compliance with HIPAA regulations.</p>
                </div>
            </div>
        </div>
    );
};

export default UploadScanPage;