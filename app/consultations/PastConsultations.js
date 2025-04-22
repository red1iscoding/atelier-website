import { FaHistory } from 'react-icons/fa';  // Import the icon

const PastConsultations = () => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center"> {/* Heading updated to blue */}
        <FaHistory className="mr-2 text-xl" />
        Past Appointments
      </h2>

      <div className="flex space-x-6">
        {/* Card 1 - Completed */}
        <div className="bg-green-100 rounded-xl shadow-md w-full max-w-sm p-6">
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Date</p>
            <p className="text-lg font-semibold text-gray-900">5th March 2025</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 text-sm">Physician</p>
            <p className="text-lg font-semibold text-gray-900">Dr. Lila Benali </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-500 text-sm">Appointment Type</p>
            <p className="text-lg font-semibold text-gray-900">In-Person</p>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">Status</p>
            <p className="text-green-600 text-lg font-semibold">Completed</p>
          </div>

          {/* Action Section */}
          <div className="flex justify-between space-x-4">
            <button className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-full border border-blue-600 transition-all duration-200">
              View Report
            </button>
          </div>
        </div>

        {/* Card 2 - Follow-up Required */}
        <div className="bg-yellow-100 rounded-xl shadow-md w-full max-w-sm p-6">
          <div className="mb-4">
            <p className="text-gray-500 text-sm">Date</p>
            <p className="text-lg font-semibold text-gray-900">20th January 2025</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 text-sm">Physician</p>
            <p className="text-lg font-semibold text-gray-900">Dr. Malik Haddad</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-500 text-sm">Appointment Type</p>
            <p className="text-lg font-semibold text-gray-900">Video Call</p>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">Status</p>
            <p className="text-yellow-600 text-lg font-semibold">Follow-up Required</p>
          </div>

          <div className="flex justify-between space-x-4">
            <button className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-full border border-blue-600 transition-all duration-200">
              View Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastConsultations;
