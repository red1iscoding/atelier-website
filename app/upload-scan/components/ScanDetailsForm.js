// app/upload-scan/components/ScanDetailsForm.js


'use client';  // Add this line at the top

import React, { useState } from 'react';

const ScanDetailsForm = () => {
    const [scanDate, setScanDate] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!scanDate) {
            setError("Please provide the date of the scan.");
        } else {
            alert("Scan details submitted successfully!");
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-2xl font-semibold text-[#de0b0b] mb-4">Scan Details</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700">Date of Scan:</label>
                    <input
                        type="date"
                        value={scanDate}
                        onChange={(e) => setScanDate(e.target.value)}
                        required
                        placeholder="MM/DD/YYYY"
                        className="mt-2 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#de0b0b]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700">Doctor/Facility Name (Optional):</label>
                    <input
                        type="text"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="mt-2 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#de0b0b]"
                        placeholder="Enter doctor's name or facility"
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="mt-4 w-full py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition duration-200"
                >
                    Submit Scan Details
                </button>
            </form>
        </div>
    );
};

export default ScanDetailsForm;
