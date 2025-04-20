'use client';

import Navbar from '../Navbar';  // Importing Navbar
import { useState } from 'react';
import { FaFileMedical, FaSearch, FaUpload, FaEye, FaPlus, FaTrashAlt } from 'react-icons/fa';  // Icons

const ScanManagement = () => {
  const [scans, setScans] = useState([
    { id: 1, scanId: 'S123', patientName: 'User X', status: 'Completed', date: 'March 20, 2025', scanFileName: 'scan1.pdf', scanFile: 'scan1.pdf' },
    { id: 2, scanId: 'S124', patientName: 'User Y', status: 'Processing', date: 'March 19, 2025', scanFileName: 'scan2.png', scanFile: 'scan2.png' },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isAddingScan, setIsAddingScan] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State to manage the delete modal
  const [scanToDelete, setScanToDelete] = useState(null); // Track the scan to be deleted
  const [selectedScan, setSelectedScan] = useState(null);
  const [newScanFile, setNewScanFile] = useState('');
  const [newScanFileName, setNewScanFileName] = useState('');
  const [newScanPatientName, setNewScanPatientName] = useState('');
  const [newScanDate, setNewScanDate] = useState('');
  const [newScanStatus, setNewScanStatus] = useState('');
  const [scanToUpload, setScanToUpload] = useState(null); // For uploading a specific scan

  const handleViewScan = (scanId) => {
    const scan = scans.find(scan => scan.scanId === scanId);
    setSelectedScan(scan);
    setIsViewing(true);
  };

  const handleUploadScan = (scan) => {
    setScanToUpload(scan); // Set the scan to upload
    setIsUploading(true); // Show the upload modal for the selected scan
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewScanFile(file);
    setNewScanFileName(file.name);
  };

  const saveScanUpload = () => {
    const updatedScan = {
      ...scanToUpload,
      patientName: newScanPatientName || scanToUpload.patientName,
      status: newScanStatus || scanToUpload.status,
      date: newScanDate || scanToUpload.date,
      scanFileName: newScanFileName || scanToUpload.scanFileName,
      scanFile: newScanFileName || scanToUpload.scanFile, // Update this to store the file URL later
    };

    const updatedScans = scans.map(scan =>
      scan.scanId === scanToUpload.scanId ? updatedScan : scan
    );

    setScans(updatedScans);
    setIsUploading(false);
    setNewScanFile('');
    setNewScanFileName('');
    setNewScanPatientName('');
    setNewScanDate('');
    setNewScanStatus('');
    setScanToUpload(null); // Reset the scan to upload
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setNewScanFile('');
    setNewScanFileName('');
    setNewScanPatientName('');
    setNewScanDate('');
    setNewScanStatus('');
    setScanToUpload(null); // Reset the scan to upload
  };

  const closeViewModal = () => {
    setIsViewing(false);
    setSelectedScan(null);
  };

  const handleAddNewScan = () => {
    setIsAddingScan(true);  // Set state to show the "Add New Scan" modal
  };

  const saveNewScan = () => {
    const newScan = {
      scanId: `S${Date.now()}`,  // Generate a unique scan ID based on timestamp
      patientName: newScanPatientName,
      status: newScanStatus,
      date: newScanDate,
      scanFileName: newScanFileName,
      scanFile: newScanFileName, // You can update this to store the file URL later
    };

    setScans(prevScans => [...prevScans, newScan]);
    setIsAddingScan(false);  // Close the "Add New Scan" modal
    setNewScanFile('');
    setNewScanFileName('');
    setNewScanPatientName('');
    setNewScanDate('');
    setNewScanStatus('');
  };

  const handleDeleteScan = (scan) => {
    setScanToDelete(scan);  // Store the scan to be deleted
    setIsDeleting(true);  // Show the delete confirmation modal
  };

  const confirmDeleteScan = () => {
    // Delete the scan from the list
    const updatedScans = scans.filter(scan => scan.scanId !== scanToDelete.scanId);
    setScans(updatedScans);  // Update the scans list
    setIsDeleting(false);  // Close the confirmation modal
    setScanToDelete(null); // Reset the scan to be deleted
  };

  const cancelDeleteScan = () => {
    setIsDeleting(false);  // Close the confirmation modal
    setScanToDelete(null); // Reset the scan to be deleted
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20">
        <h2 className="text-3xl font-semibold mb-6">Scan Management</h2>

        {/* Add Scan Button */}
        <div className="fixed bottom-4 right-4 z-20">
          <button 
            onClick={handleAddNewScan}  // This will open the modal to add new scan
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            title="Add Scan"
          >
            <FaPlus /> Add New Scan
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center w-1/2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search scans..."
                className="w-full p-3 pl-10 pr-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Scan Table */}
        <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-700 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-white">Scan ID</th>
                <th className="p-4 text-left text-white">Patient Name</th>
                <th className="p-4 text-left text-white">Scan File</th>
                <th className="p-4 text-left text-white">Status</th>
                <th className="p-4 text-left text-white">Date</th>
                <th className="p-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.scanId} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300">
                  <td className="p-4 text-white">{scan.scanId}</td>
                  <td className="p-4 text-white">{scan.patientName}</td>
                  <td className="p-4 text-white">{scan.scanFileName}</td>
                  <td className={`p-4 ${scan.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{scan.status}</td>
                  <td className="p-4 text-white">{scan.date}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300 w-24"
                      title="View"
                      onClick={() => handleViewScan(scan.scanId)} // Show the scan
                    >
                      <FaEye /> View
                    </button>
                    <button
                      onClick={() => handleUploadScan(scan)} // Open upload modal for the selected scan
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all duration-300 w-24"
                      title="Upload Scan"
                    >
                      <FaUpload /> Upload Scan
                    </button>
                    <button
                      onClick={() => handleDeleteScan(scan)}  // Open delete confirmation modal
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-300 w-24"
                      title="Delete Scan"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleting && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/2">
              <h3 className="text-2xl font-semibold text-white mb-4">Confirm Deletion</h3>
              <p className="text-white">Are you sure you want to delete this scan?</p>
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={cancelDeleteScan} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300">
                  Cancel
                </button>
                <button onClick={confirmDeleteScan} className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-all duration-300">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Scan Modal */}
        {isAddingScan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/2">
              <h3 className="text-2xl font-semibold text-white mb-4">Add New Scan</h3>

              {/* Patient Name */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-white">Patient Name:</label>
                <input
                  type="text"
                  value={newScanPatientName}
                  onChange={(e) => setNewScanPatientName(e.target.value)}
                  className="p-2 w-full bg-gray-100 rounded-md"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-white">Status:</label>
                <select
                  value={newScanStatus}
                  onChange={(e) => setNewScanStatus(e.target.value)}
                  className="p-2 w-full bg-gray-100 rounded-md"
                >
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-white">Date:</label>
                <input
                  type="date"
                  value={newScanDate}
                  onChange={(e) => setNewScanDate(e.target.value)}
                  className="p-2 w-full bg-gray-100 rounded-md"
                />
              </div>

              {/* Scan File */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-white">Select Scan File:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="p-2 w-full bg-gray-100 rounded-md"
                />
                {newScanFileName && (
                  <p className="mt-2 text-sm text-white">Selected File: {newScanFileName}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4">
                <button onClick={handleCancelUpload} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300">
                  Cancel
                </button>
                <button onClick={saveNewScan} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-all duration-300">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Scan Modal */}
        {isViewing && selectedScan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/2">
              <h3 className="text-2xl font-semibold text-white mb-4">Scan Details</h3>
              <p className="text-white"><strong>Scan ID:</strong> {selectedScan.scanId}</p>
              <p className="text-white"><strong>Patient:</strong> {selectedScan.patientName}</p>
              <p className="text-white"><strong>Status:</strong> {selectedScan.status}</p>
              <p className="text-white"><strong>Date:</strong> {selectedScan.date}</p>
              <p className="text-white"><strong>File Name:</strong> {selectedScan.scanFileName}</p>
              {/* Assuming the scan is a PDF or image, you can embed it like this */}
              <div className="mt-4">
                <iframe
                  src={`/path/to/scans/${selectedScan.scanFile}`}
                  title="Scan File"
                  width="100%"
                  height="500px"
                ></iframe>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={closeViewModal} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-white">Showing 1 to 10 of 100 scans</span>
          <div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-l-md hover:bg-gray-800 transition-all duration-300">Previous</button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-all duration-300">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanManagement;
