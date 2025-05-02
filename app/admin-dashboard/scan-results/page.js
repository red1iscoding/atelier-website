'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaFileMedical, FaSearch, FaUpload, FaEye, FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import Navbar from '../Navbar';

const ImageDisplayComponent = ({ filePath, fileType }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const getScanFile = useCallback(async (path) => {
    try {
      if (!path) {
        console.error('No file path provided');
        return null;
      }

      const cleanPath = String(path).replace(/['"]/g, '').trim();
      
      const { data, error } = await supabase.storage
        .from('medical-scans')
        .download(cleanPath);

      if (error) {
        console.error('Download error:', error);
        return null;
      }

      return URL.createObjectURL(data);
    } catch (err) {
      console.error('Error in getScanFile:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    let objectUrl = null;

    const loadImage = async () => {
      try {
        const url = await getScanFile(filePath);
        if (url) {
          setImageUrl(url);
          setError(null);
        } else {
          setError('Failed to load image');
        }
      } catch (err) {
        console.error('Image load error:', err);
        setError('Error loading image');
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [filePath, getScanFile]);

  if (error) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-70">
          <p>{error}</p>
          <button
            onClick={async () => {
              const url = await getScanFile(filePath);
              if (url) {
                window.open(url, '_blank');
              }
            }}
            className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            Try Direct Download
          </button>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-white">Loading image...</p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Medical Scan"
      className="w-full h-full object-contain"
      onError={(e) => {
        console.error('Image render error:', e);
        setError('Failed to display image');
      }}
    />
  );
};

const ScanManagement = () => {
  // State management
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewing, setIsViewing] = useState(false);
  const [isAddingScan, setIsAddingScan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scanToDelete, setScanToDelete] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [newScanFile, setNewScanFile] = useState(null);
  const [newScanPatientId, setNewScanPatientId] = useState('');
  const [newScanType, setNewScanType] = useState('');
  const [newScanStatus, setNewScanStatus] = useState('pending_review');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editFile, setEditFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Data fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let scansQuery = supabase
        .from('scans')
        .select('*, users(full_name, email)')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        scansQuery = scansQuery.or(
          `users.full_name.ilike.%${searchTerm}%,scan_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`
        );
      }

      const usersQuery = supabase
        .from('users')
        .select('user_id, full_name')
        .order('full_name', { ascending: true });

      const [
        { data: scansData, error: scansError },
        { data: usersData, error: usersError }
      ] = await Promise.all([scansQuery, usersQuery]);

      if (scansError) throw scansError;
      if (usersError) throw usersError;

      setScans(scansData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // File handling
  const uploadScanFile = useCallback(async (file) => {
    try {
      if (!file) throw new Error('No file selected');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `scans/${fileName}`;

      const { data, error } = await supabase.storage
        .from('medical-scans')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
          cacheControl: '3600',
        });

      if (error) throw error;

      // Explicitly update file to ensure public access
      await supabase.storage
        .from('medical-scans')
        .update(filePath, null, {
          cacheControl: '3600',
          upsert: true
        });

      return { filePath, fileName };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file: ' + error.message);
    }
  }, []);

  // Scan operations
  const saveNewScan = useCallback(async () => {
    try {
      if (!newScanFile) throw new Error('Please select a file to upload');

      const { filePath, fileName } = await uploadScanFile(newScanFile);

      const { data, error } = await supabase
        .from('scans')
        .insert([{
          user_id: newScanPatientId,
          scan_type: newScanType,
          file_name: fileName,
          file_path: filePath,
          file_type: newScanFile.type,
          status: newScanStatus
        }])
        .select();

      if (error) throw error;

      await fetchData();
      setIsAddingScan(false);
      resetForm();
      
      return data[0];
    } catch (error) {
      console.error('Error adding new scan:', error);
      setUploadError(error.message);
      throw error;
    }
  }, [newScanFile, newScanPatientId, newScanType, newScanStatus, uploadScanFile, fetchData]);

  const updateScan = useCallback(async () => {
    try {
      let updates = {
        user_id: newScanPatientId,
        scan_type: newScanType,
        status: newScanStatus
      };

      if (editFile) {
        const { error: deleteError } = await supabase.storage
          .from('medical-scans')
          .remove([selectedScan.file_path]);

        if (deleteError) throw deleteError;

        const { filePath, fileName } = await uploadScanFile(editFile);
        updates.file_path = filePath;
        updates.file_name = fileName;
        updates.file_type = editFile.type;
      }

      const { data, error } = await supabase
        .from('scans')
        .update(updates)
        .eq('scan_id', selectedScan.scan_id)
        .select();

      if (error) throw error;

      await fetchData();
      setIsEditing(false);
      resetForm();
      
      return data;
    } catch (error) {
      console.error('Error updating scan:', error);
      setUploadError(error.message);
      throw error;
    }
  }, [editFile, newScanPatientId, newScanType, newScanStatus, selectedScan, uploadScanFile, fetchData]);

  const confirmDeleteScan = useCallback(async () => {
    try {
      const { error: storageError } = await supabase.storage
        .from('medical-scans')
        .remove([scanToDelete.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('scans')
        .delete()
        .eq('scan_id', scanToDelete.scan_id);

      if (dbError) throw dbError;
      
      await fetchData();
    } catch (error) {
      console.error('Error deleting scan:', error);
      setUploadError(error.message);
    } finally {
      setIsDeleting(false);
      setScanToDelete(null);
    }
  }, [scanToDelete, fetchData]);

  // UI handlers
  const handleViewScan = (scan) => {
    setSelectedScan(scan);
    setIsViewing(true);
  };

  const handleEditScan = (scan) => {
    setSelectedScan(scan);
    setNewScanPatientId(scan.user_id);
    setNewScanType(scan.scan_type);
    setNewScanStatus(scan.status);
    setIsEditing(true);
  };

  const handleAddNewScan = () => {
    setIsAddingScan(true);
    setUploadError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPEG, PNG, and PDF files are allowed');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size must be less than 50MB');
      return;
    }

    setNewScanFile(file);
    setUploadError(null);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPEG, PNG, and PDF files are allowed');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size must be less than 50MB');
      return;
    }

    setEditFile(file);
    setUploadError(null);
  };

  const resetForm = () => {
    setNewScanFile(null);
    setEditFile(null);
    setNewScanPatientId('');
    setNewScanType('');
    setNewScanStatus('pending_review');
    setUploadError(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
        <Navbar />
        <div className="flex-1 p-6 mt-20 flex justify-center items-center">
          <p>Loading scans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20">
        <h2 className="text-3xl font-semibold mb-6">Scan Management</h2>

        {/* Add Scan Button */}
        <div className="fixed bottom-4 right-4 z-20">
          <button 
            onClick={handleAddNewScan}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            <FaPlus /> Add New Scan
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center w-1/2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search scans..."
                className="w-full p-3 pl-10 pr-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {uploadError}
          </div>
        )}

        {/* Scan Table */}
        <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-700 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-white">Scan ID</th>
                <th className="p-4 text-left text-white">Patient</th>
                <th className="p-4 text-left text-white">File</th>
                <th className="p-4 text-left text-white">Type</th>
                <th className="p-4 text-left text-white">Status</th>
                <th className="p-4 text-left text-white">Date</th>
                <th className="p-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.scan_id} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300">
                  <td className="p-4 text-white">{scan.scan_id}</td>
                  <td className="p-4 text-white">
                    <div>{scan.users?.full_name}</div>
                    <div className="text-xs text-gray-400">{scan.users?.email}</div>
                  </td>
                  <td className="p-4 text-white">
                    <div className="truncate max-w-xs">{scan.file_name}</div>
                    <div className="text-xs text-gray-400">{scan.file_type}</div>
                  </td>
                  <td className="p-4 text-white capitalize">{scan.scan_type?.replace('_', ' ')}</td>
                  <td className={`p-4 capitalize ${
                    scan.status === 'completed' ? 'text-green-500' :
                    scan.status === 'pending_review' ? 'text-yellow-500' : 'text-gray-500'
                  }`}>
                    {scan.status?.replace('_', ' ')}
                  </td>
                  <td className="p-4 text-white">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleViewScan(scan)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditScan(scan)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all duration-300"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteScan(scan)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-300"
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleting && scanToDelete && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold text-white mb-4">Confirm Deletion</h3>
              <p className="text-white">Are you sure you want to delete this scan?</p>
              <div className="flex justify-end gap-4 mt-4">
                <button 
                  onClick={() => setIsDeleting(false)} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteScan} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Scan Modal */}
        {isAddingScan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold text-white mb-4">Add New Scan</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Patient</label>
                  <select
                    value={newScanPatientId}
                    onChange={(e) => setNewScanPatientId(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    required
                  >
                    <option value="">Select Patient</option>
                    {users.map(user => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Scan Type</label>
                  <input
                    type="text"
                    value={newScanType}
                    onChange={(e) => setNewScanType(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    placeholder="e.g. X-Ray, MRI"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={newScanStatus}
                    onChange={(e) => setNewScanStatus(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    <option value="pending_review">Pending Review</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Scan File</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    accept=".pdf,.jpg,.jpeg,.png,.dicom"
                    required
                  />
                  {newScanFile && (
                    <p className="mt-1 text-sm text-gray-400">Selected: {newScanFile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button 
                  onClick={() => {
                    setIsAddingScan(false);
                    resetForm();
                  }} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await saveNewScan();
                    } catch (error) {
                      // Error is already handled in saveNewScan
                    }
                  }} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                  disabled={!newScanFile || !newScanPatientId || !newScanType}
                >
                  Upload Scan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Scan Modal */}
        {isEditing && selectedScan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold text-white mb-4">Edit Scan</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Patient</label>
                  <select
                    value={newScanPatientId}
                    onChange={(e) => setNewScanPatientId(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    required
                  >
                    <option value="">Select Patient</option>
                    {users.map(user => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Scan Type</label>
                  <input
                    type="text"
                    value={newScanType}
                    onChange={(e) => setNewScanType(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    placeholder="e.g. X-Ray, MRI"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={newScanStatus}
                    onChange={(e) => setNewScanStatus(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    <option value="pending_review">Pending Review</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current File</label>
                  <div className="p-2 bg-gray-700 rounded text-white">
                    {selectedScan.file_name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Replace File (Optional)</label>
                  <input
                    type="file"
                    onChange={handleEditFileChange}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    accept=".pdf,.jpg,.jpeg,.png,.dicom"
                  />
                  {editFile && (
                    <p className="mt-1 text-sm text-gray-400">New file: {editFile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                  }} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await updateScan();
                    } catch (error) {
                      // Error is already handled in updateScan
                    }
                  }} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Scan Modal */}
        {isViewing && selectedScan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col">
              <h3 className="text-2xl font-semibold text-white mb-4">Scan Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Scan ID</p>
                    <p className="text-white">{selectedScan.scan_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Patient</p>
                    <p className="text-white">{selectedScan.users?.full_name}</p>
                    <p className="text-xs text-gray-400">{selectedScan.users?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Scan Type</p>
                    <p className="text-white capitalize">{selectedScan.scan_type?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <p className={`capitalize ${
                      selectedScan.status === 'completed' ? 'text-green-500' :
                      selectedScan.status === 'pending_review' ? 'text-yellow-500' : 'text-gray-500'
                    }`}>
                      {selectedScan.status?.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">File Info</p>
                    <p className="text-white">{selectedScan.file_name}</p>
                    <p className="text-xs text-gray-400">{selectedScan.file_type}</p>
                  </div>
                </div>
              </div>

              {/* Image Display Component */}
              <div className="flex-1 bg-black rounded-lg overflow-hidden mt-4 flex items-center justify-center">
                {selectedScan.file_type?.includes('pdf') ? (
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medical-scans/${encodeURIComponent(selectedScan.file_path)}`}
                    title="Scan File"
                    width="100%"
                    height="100%"
                    className="min-h-[400px]"
                  />
                ) : (
                  <ImageDisplayComponent 
                    filePath={selectedScan.file_path} 
                    fileType={selectedScan.file_type}
                  />
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setIsViewing(false)} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-white">Showing {scans.length} scans</span>
        </div>
      </div>
    </div>
  );
};

export default ScanManagement;