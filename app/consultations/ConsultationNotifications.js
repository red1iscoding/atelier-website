import { FaBell } from 'react-icons/fa';  // Import the icon

const ConsultationNotifications = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center"> {/* Heading updated to blue */}
        <FaBell className="mr-2 text-xl" />
        Consultation Reminders
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Upcoming Appointment Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold">Upcoming Appointment</p>
          <p className="text-xl font-semibold text-gray-900">12th March 2025 - 10:00 AM</p>
          <p className="text-gray-600 text-sm mt-2">Physician: Dr. John Doe (Orthopedics)</p>
        </div>

        {/* Reminder Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="text-gray-600 text-sm font-semibold">Reminder Time</p>
          <p className="text-lg font-semibold text-gray-900">1 Hour Before</p>
        </div>

        {/* Action Section */}
        <div className="space-y-4">
          <button className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-all duration-200">
            Manage Notifications
          </button>
          <button className="w-full bg-[#003366] text-white py-3 rounded-full hover:bg-blue-700 transition-all duration-200"> {/* Changed to blue */}
            Turn Off Reminders
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationNotifications;
