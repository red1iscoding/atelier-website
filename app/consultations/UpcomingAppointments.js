import { FaClock } from 'react-icons/fa';  // Import the icon

const UpcomingAppointments = () => {
  const appointments = [
    {
      id: 1,
      date: '12th March 2025 - 10:00 AM',
      type: 'Video Consultation',
      physician: 'Dr. Ahmed Belkacem',
      status: 'Confirmed',
    },
    {
      id: 2,
      date: '15th March 2025 - 2:00 PM',
      type: 'In-Person Consultation',
      physician: 'Dr. Samira Kaci',
      status: 'Pending',
    },
    {
      id: 3,
      date: '18th March 2025 - 9:00 AM',
      type: 'Video Consultation',
      physician: 'Dr. Samira Kaci',
      status: 'Confirmed',
    }
  ];

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center">
        <FaClock className="mr-2 text-xl" />
        Upcoming Appointments
      </h2>

      {/* Flex container for the cards */}
      <div className="flex flex-wrap gap-6">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-xl shadow-md w-full max-w-sm p-6">
            {/* Appointment Info Section */}
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Date</p>
              <p className="text-lg font-semibold text-gray-900">{appointment.date}</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm">Appointment Type</p>
              <p className="text-lg font-semibold text-gray-900">{appointment.type}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-sm">Physician</p>
              <p className="text-lg font-semibold text-gray-900">{appointment.physician}</p>
            </div>

            {/* Status Section */}
            <div className="mb-6">
              <p className="text-gray-500 text-sm">Status</p>
              <p className={`text-lg font-semibold ${appointment.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-500'}`}>
                {appointment.status}
              </p>
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
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
