// app/consultations/ConfirmAppointment.js
'use client';  // This marks the file as a client component

import { useRouter } from 'next/navigation';  // Importing useRouter from next/navigation

const ConfirmAppointment = () => {
  const router = useRouter();
  const { consultationType, physician, date, time } = router.query;  // Accessing query params

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <div className="flex flex-1 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-red-600 mb-6">Your Appointment Details</h2>

          {/* Appointment Details */}
          <div className="space-y-4">
            <p><strong>Consultation Type:</strong> {consultationType}</p>
            <p><strong>Physician:</strong> {physician}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Time:</strong> {time}</p>

            {/* Payment and Confirmation Button */}
            <div className="mt-6">
              <button 
                className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all duration-200"
                onClick={() => alert('Your appointment has been confirmed!')}
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAppointment;
