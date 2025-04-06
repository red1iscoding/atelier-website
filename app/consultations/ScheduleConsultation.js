// app/consultations/ScheduleConsultation.js
'use client';

import { useRouter } from 'next/navigation';  // For navigation
import { FaCalendarCheck } from 'react-icons/fa';  // Icon for the button

const ScheduleConsultation = () => {
  const router = useRouter();

  // Navigate to /create-appointment page
  const handleBookConsultation = () => {
    router.push('/create-appointment');  // Update path to /create-appointment
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-red-600 mb-4 flex items-center">
        <FaCalendarCheck className="mr-2 text-xl" />
        Book a Consultation
      </h2>

      <button
        className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-all duration-200"
        onClick={handleBookConsultation}  // Navigate to CreateAppointment.js when clicked
      >
        Book Consultation
      </button>
    </div>
  );
};

export default ScheduleConsultation;
