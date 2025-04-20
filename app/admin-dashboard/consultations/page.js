'use client';

import Navbar from '../Navbar';  // Importing Navbar
import { useState, useEffect } from 'react';  // Import useState and useEffect hooks
import { FaSearch, FaEye, FaEdit, FaTimes } from 'react-icons/fa';  // Icons

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [isClient, setIsClient] = useState(false);  // Add state to check if it's client-side

  useEffect(() => {
    setIsClient(true);  // Set true once the component is mounted on the client side
  }, []);

  // Function to fetch consultations from the backend (FastAPI route)
  useEffect(() => {
    if (isClient) {  // Only fetch consultations after the component is mounted on the client side
      fetchConsultations();
    }
  }, [isClient]);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/admin/consultations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Send the token with the request
        },
      });
      const data = await response.json();
      if (response.ok) {
        setConsultations(data.consultations);
      } else {
        console.error('Error fetching consultations:', data);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const handleReschedule = (consultationId, currentDate) => {
    setIsRescheduling(true);
    setSelectedConsultation(consultationId);
    setNewDate(currentDate);  // Pre-fill the date input with the current date
  };

  const handleDateChange = (e) => {
    setNewDate(e.target.value);
  };

  const saveReschedule = () => {
    // Send the PUT request to update the consultation date
    fetch(`http://127.0.0.1:8000/admin/consultations/${selectedConsultation}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Send the token with the request
      },
      body: JSON.stringify({ date: newDate }),  // Pass the updated date in the body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Consultation updated successfully.') {
          setConsultations(prevConsultations =>
            prevConsultations.map(consultation =>
              consultation.consultationId === selectedConsultation
                ? { ...consultation, date: newDate }
                : consultation
            )
          );
        }
        setIsRescheduling(false);
        setSelectedConsultation(null);
      })
      .catch((err) => console.error('Error rescheduling consultation:', err));
  };

  const handleCancel = (consultationId) => {
    // Send DELETE request to cancel the consultation
    fetch(`http://127.0.0.1:8000/admin/consultations/${consultationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Send the token with the request
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Consultation canceled successfully.') {
          setConsultations((prevConsultations) =>
            prevConsultations.filter(
              (consultation) => consultation.consultationId !== consultationId
            )
          );
        }
      })
      .catch((err) => console.error('Error canceling consultation:', err));
  };

  const handleViewDetails = (consultationId) => {
    // Set the consultation that needs to be viewed
    const consultation = consultations.find(c => c.consultationId === consultationId);
    setSelectedConsultation(consultation);
    setIsViewing(true);  // Show the modal
  };

  const closeViewModal = () => {
    setIsViewing(false);
    setSelectedConsultation(null);  // Clear the selected consultation
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20">
        <h2 className="text-3xl font-semibold mb-6">Consultations</h2>

        {/* Search Bar Section */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center w-1/2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search consultations..."
                className="w-full p-3 pl-10 pr-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-700 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-white">Consultation ID</th>
                <th className="p-4 text-left text-white">Patient</th>
                <th className="p-4 text-left text-white">Date</th>
                <th className="p-4 text-left text-white">Type</th>
                <th className="p-4 text-left text-white">Status</th>
                <th className="p-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300">
                  <td className="p-4 text-white">{consultation.consultationId}</td>
                  <td className="p-4 text-white">{consultation.patient}</td>
                  <td className="p-4 text-white">{consultation.date}</td>
                  <td className="p-4 text-white">{consultation.type}</td>
                  <td className={`p-4 ${consultation.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{consultation.status}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300 w-24"
                      onClick={() => handleViewDetails(consultation.consultationId)} // On click, show the modal with details
                      title="View"
                    >
                      <FaEye /> View
                    </button>
                    <button
                      onClick={() => handleReschedule(consultation.consultationId, consultation.date)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all duration-300 w-24"
                      title="Reschedule"
                    >
                      <FaEdit /> Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(consultation.consultationId)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-300 w-24"
                      title="Cancel"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reschedule and View Modals */}
        {isRescheduling && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/2">
              <h3 className="text-2xl font-semibold text-white mb-4">Reschedule Consultation</h3>
              <div className="mb-4">
                <label className="block text-lg font-semibold text-white">New Date:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={handleDateChange}
                  className="p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button onClick={() => setIsRescheduling(false)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-all duration-300">
                  Cancel
                </button>
                <button onClick={saveReschedule} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-all duration-300">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {isViewing && selectedConsultation && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/2">
              <h3 className="text-2xl font-semibold text-white mb-4">Consultation Details</h3>
              <p className="text-white"><strong>Consultation ID:</strong> {selectedConsultation.consultationId}</p>
              <p className="text-white"><strong>Patient:</strong> {selectedConsultation.patient}</p>
              <p className="text-white"><strong>Date:</strong> {selectedConsultation.date}</p>
              <p className="text-white"><strong>Type:</strong> {selectedConsultation.type}</p>
              <p className="text-white"><strong>Status:</strong> {selectedConsultation.status}</p>
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
          <span className="text-white">Showing 1 to 10 of 100 consultations</span>
          <div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-l-md hover:bg-gray-800 transition-all duration-300">Previous</button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-all duration-300">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultations;
