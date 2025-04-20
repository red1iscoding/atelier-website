import { FaClock } from 'react-icons/fa';  // Import the icon

const UpcomingAppointments = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center"> {/* Heading updated to blue */}
        <FaClock className="mr-2 text-xl" />
        Upcoming Appointments
      </h2>

      {/* Flex container for the cards */}
      <div className="flex space-x-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-md w-full max-w-sm p-6">
          {/* Appointment Info Section */}
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Date</p>
            <p className="text-lg font-semibold text-gray-900">12th March 2025 - 10:00 AM</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 text-sm">Appointment Type</p>
            <p className="text-lg font-semibold text-gray-900">Video Consultation</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-500 text-sm">Physician</p>
            <p className="text-lg font-semibold text-gray-900">Dr. John Doe (Orthopedics)</p>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">Status</p>
            <p className="text-lg font-semibold text-green-600">Confirmed</p>
          </div>

          {/* Action Section */}
          <div className="flex justify-between space-x-4">
            <button className="text-[#003366] hover:bg-blue-100 py-2 px-4 rounded-full border border-[#003366] transition-all duration-200">
              Cancel
            </button>
            <button className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-full border border-blue-600 transition-all duration-200">
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointments;
