'use client'; // For client-side navigation

import { useRouter } from 'next/navigation';  // For programmatic navigation
import { FaCalendarCheck } from 'react-icons/fa';  // Icon for the button

const ScheduleConsultation = () => {
  const router = useRouter();

  // Correct path to navigate to /consultations/create-appointment
  const handleBookConsultation = () => {
    router.push('/consultations/create-appointment'); // Correct path to navigate to CreateAppointment page
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#003366] mb-4 flex items-center">
        <FaCalendarCheck className="mr-2 text-xl" />
        Book an Appointment
      </h2>

      <button
        className="w-full bg-[#003366] text-white py-3 rounded-full hover:bg-blue-700 transition-all duration-200"
        onClick={handleBookConsultation}  // Navigates to CreateAppointment.js when clicked
      >
        Book Appointment
      </button>
    </div>
  );
};

export default ScheduleConsultation;
