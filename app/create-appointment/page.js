// app/create-appointment/page.js
'use client';

import { useState } from 'react';  // Import useState for managing form data
import { useRouter } from 'next/navigation';  // For programmatic navigation
import { FaCalendarAlt, FaUserMd, FaVideo } from 'react-icons/fa';  // Icons for UI

const CreateAppointment = () => {
  const router = useRouter();

  // States to manage form inputs
  const [consultationType, setConsultationType] = useState('');
  const [physician, setPhysician] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Simulated list of doctors (you could fetch this from a backend later)
  const doctors = [
    { name: 'Dr. John Doe', specialty: 'Orthopedics' },
    { name: 'Dr. Jane Smith', specialty: 'Cardiology' },
  ];

  // Handle form submission and navigate to confirmation page
  const handleConfirmAppointment = () => {
    if (!consultationType || !physician || !date || !time) {
      alert('Please fill in all fields');
      return;
    }

    // Navigate to the confirm appointment page and pass the selected data
    router.push({
      pathname: '/confirm-appointment',  // Routing to /confirm-appointment
      query: {
        consultationType,
        physician,
        date,
        time,
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-gray-800">
      <div className="w-full max-w-3xl p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-red-600 mb-6 flex items-center">
          <FaCalendarAlt className="mr-2 text-xl" />
          Select Consultation Details
        </h2>

        {/* Consultation Type */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Consultation Type</h3>
          <div className="flex space-x-6">
            <button
              className="w-1/2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              onClick={() => setConsultationType('Video Call')}
            >
              <FaVideo className="mr-2" />
              Video Consultation
            </button>
            <button
              className="w-1/2 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
              onClick={() => setConsultationType('In-Person')}
            >
              <FaUserMd className="mr-2" />
              In-Person Consultation
            </button>
          </div>
        </div>

        {/* Select Physician */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Physician</h3>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={physician}
            onChange={(e) => setPhysician(e.target.value)}
          >
            <option value="">Select a Physician</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor.name}>
                {doctor.name} ({doctor.specialty})
              </option>
            ))}
          </select>
        </div>

        {/* Select Date */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Date</h3>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Select Time */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Time</h3>
          <input
            type="time"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* Confirm Appointment Button */}
        <button
          className="w-full py-3 px-6 bg-red-600 text-white rounded-lg mt-6 hover:bg-red-700 transition-all duration-200"
          onClick={handleConfirmAppointment}
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default CreateAppointment;
