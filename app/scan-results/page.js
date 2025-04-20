"use client"; // Mark this file as a client component

import React from 'react';
import Navbar from '../../components/Navbar'; // Assuming Navbar is a reusable component
import Footer from '../../components/Footer';
import Sidebar from "../../components/Sidebar"; // Import Sidebar
import { FaFileAlt, FaCalendarAlt, FaUserMd, FaHeartbeat, FaDownload, FaRedo } from 'react-icons/fa'; // Import icons

const ScanResults = () => {
  // Hardcoded scan data for the static version
  const scanData = {
    patientName: 'John Doe',
    scanType: 'X-ray',
    scanDate: '2025-03-27',
    fileName: 'X-ray 001.png',
    physicianComments: 'No abnormalities detected.',
    imageUrl: '/images/scan-result.png', // Update this with your actual image path
    aiResults: [
      { diseaseName: 'Pneumonia', confidence: 89 },
      { diseaseName: 'COVID-19', confidence: 45 },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Sidebar Component */}
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 pt-24"> {/* Added pt-24 to give space for the navbar */}
          <Navbar />

          <div className="container mx-auto px-6 py-12">
            {/* Header with Blue Text */}
            <div className="header mb-8 text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#003366]">Scan Results</h1> {/* Heading updated to blue */}
              <p className="text-xl sm:text-2xl text-[#003366] mt-2 font-semibold">
                Here are the detailed results of your scan analysis.
              </p>
              <p className="text-lg sm:text-xl text-[#003366] mt-4 font-medium">
                Patient: {scanData.patientName}, Age: 30, Scan Type: {scanData.scanType}, Date: {scanData.scanDate}
              </p>
            </div>

            {/* Scan Overview Section */}
            <section className="scan-overview bg-white p-6 rounded-lg shadow-lg mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <FaFileAlt className="text-[#003366] text-3xl" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Scan Overview</h2>
              </div>

              {/* Patient and Scan Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="info-card bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Patient Information</h3>
                  <p className="text-md text-gray-700 mt-2"><strong>Name:</strong> {scanData.patientName}</p>
                  <p className="text-md text-gray-700 mt-2"><strong>Age:</strong> 30</p> {/* Age is hardcoded here */}
                  <p className="text-md text-gray-700 mt-2"><strong>Scan Type:</strong> {scanData.scanType}</p>
                  <p className="text-md text-gray-700 mt-2"><strong>Date:</strong> {scanData.scanDate}</p>
                </div>

                <div className="info-card bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Scan Information</h3>
                  <p className="text-md text-gray-700 mt-2"><strong>File Name:</strong> {scanData.fileName}</p>
                  <p className="text-md text-gray-700 mt-2"><strong>Scan Date:</strong> {scanData.scanDate}</p>
                  <p className="text-md text-gray-700 mt-2"><strong>Physician's Comments:</strong> {scanData.physicianComments}</p>
                </div>
              </div>

              {/* Scan Image */}
              <div className="mt-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Scan Image</h3>
                <div className="relative">
                  <img src={scanData.imageUrl} alt="X-ray Scan Image" className="max-w-full sm:max-w-1/2 mx-auto rounded-lg shadow-lg" />
                </div>
              </div>
            </section>

            {/* AI Analysis Section */}
            <section className="ai-analysis bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <FaHeartbeat className="text-[#003366] text-3xl" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">AI Analysis</h2>
              </div>
              <div className="disease-classification space-y-4">
                {scanData.aiResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    <p className="text-lg font-medium">{result.diseaseName}</p>
                    <p className="text-lg font-bold text-[#003366]">{result.confidence}%</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Download Report Section */}
            <section className="download-report bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
              <button className="w-full py-2 px-4 bg-[#003366] text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                <FaDownload className="inline-block mr-2" />
                Download PDF Report
              </button>
              <p className="text-md text-gray-500 mt-2">This is an AI-generated result. Please consult your physician for further diagnosis.</p>
            </section>

            {/* Next Steps Section */}
            <section className="next-steps bg-gray-50 p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <FaRedo className="text-[#003366] text-3xl" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">Next Steps</h2>
              </div>
              <button className="w-full py-2 px-4 bg-[#003366] text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors mb-4">
                <FaUserMd className="inline-block mr-2" />
                Consult Now
              </button>
              <button className="w-full py-2 px-4 bg-[#003366] text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                <FaFileAlt className="inline-block mr-2" />
                Re-upload Scan
              </button>
              <p className="text-md text-gray-500 mt-4">Helpful Resources:</p>
              {/* Provide links to resources */}
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ScanResults;
