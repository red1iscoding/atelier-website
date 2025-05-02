'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Sidebar from "../../components/Sidebar";
import { useRouter } from 'next/navigation';

const UploadScanPage = () => {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [file, setFile] = useState(null);
    const [scanType, setScanType] = useState('xray');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const router = useRouter();

    // Check user profile on component mount
    useEffect(() => {
        const checkUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', user.id)
                .single();

            if (error || !profile) {
                setError('Please complete your profile before uploading scans');
                // Alternatively, you could redirect to profile completion
                // router.push('/complete-profile');
            } else {
                setUserProfile(profile);
            }
        };

        checkUserProfile();
    }, [router]);

    const handleFileChange = (e) => {
        // ... (keep existing file change handler)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userProfile) {
            setError('Please complete your profile before uploading scans');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get current user (already verified in useEffect)
            const { data: { user } } = await supabase.auth.getUser();

            // Upload file to storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `user-uploads/${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('medical-scans')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Create record in scans table
            const { error: dbError } = await supabase
                .from('scans')
                .insert({
                    user_id: userProfile.user_id, // Use the integer ID from profile
                    scan_type: scanType,
                    file_name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    status: 'pending_review'
                });

            if (dbError) throw dbError;

            setUploadSuccess(true);
            setSuccessMessage('Scan uploaded successfully!');
            setFile(null);
            
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed. Please try again.');
            
            // Clean up failed upload
            if (file) {
                try {
                    const filePath = `user-uploads/${user.id}/${file.name}`;
                    await supabase.storage.from('medical-scans').remove([filePath]);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (!userProfile) {
        return (
            <div className="flex min-h-screen bg-white">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 text-center">
                        <h2 className="text-2xl font-semibold text-[#003366] mb-4">
                            Profile Required
                        </h2>
                        <p className="mb-6">Please complete your profile before uploading scans.</p>
                        <button
                            onClick={() => router.push('/complete-profile')}
                            className="px-6 py-3 bg-[#003366] text-white rounded-md hover:bg-[#002244]"
                        >
                            Complete Your Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
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
                        {/* File Upload Section */}
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

                        {/* Scan Details Section */}
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
                                
                                {/* Additional fields can be added here */}
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

                        {/* Submit Button */}
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