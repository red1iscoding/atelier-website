// app/create-appointment/page.js
'use client';

import { useState } from 'react';  // Import useState for managing form data
import { useRouter } from 'next/navigation';  // For programmatic navigation
import { FaCalendarAlt, FaUserMd, FaVideo } from 'react-icons/fa';  // Icons for UI
import DatePicker from 'react-datepicker'; // Import the DatePicker component from react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the DatePicker styles

const CreateAppointment = () => {
  const router = useRouter();

  // States to manage form inputs
  const [consultationType, setConsultationType] = useState('');
  const [physician, setPhysician] = useState('');
  const [date, setDate] = useState(null);  // Initialize date as null
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
        date: date.toISOString(),  // Make sure to convert date to string (ISO format)
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

        {/* Introduction Text */}
        <p className="text-lg text-gray-700 mb-6">
          Please choose the consultation details below to schedule your appointment. 
          Select your preferred consultation type, the physician, the date, and the time that works best for you.
        </p>

        {/* Consultation Type */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Consultation Type</h3>
          <p className="text-gray-600 mb-4">Choose the type of consultation you prefer:</p>
          <div className="flex space-x-6">
            <button
              className={`w-1/2 py-3 px-6 rounded-lg ${consultationType === 'Video Call' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'} hover:bg-blue-700 transition-all duration-200`}
              onClick={() => setConsultationType('Video Call')}
            >
              <FaVideo className="mr-2" />
              Video Consultation
            </button>
            <button
              className={`w-1/2 py-3 px-6 rounded-lg ${consultationType === 'In-Person' ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} hover:bg-green-700 transition-all duration-200`}
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
          <p className="text-gray-600 mb-4">Please choose a physician from the list below:</p>
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

        {/* Calendar Date Picker */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Date</h3>
          <p className="text-gray-600 mb-4">Choose a date for your consultation:</p>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}  // Update the state when the user selects a date
            dateFormat="MMMM d, yyyy"  // Customize the date format
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholderText="Select a date"
            inline  // This makes the calendar visible at all times (not just as a pop-up)
          />
        </div>

        {/* Select Time */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Time</h3>
          <p className="text-gray-600 mb-4">Please select a time for your consultation:</p>
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
