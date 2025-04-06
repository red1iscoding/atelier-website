// components/HealthMetrics.js
import { FaHeartbeat } from 'react-icons/fa';

export default function HealthMetrics() {
  return (
    <div className="p-6 mt-8 bg-white shadow-lg rounded-lg flex items-center">
      <FaHeartbeat className="text-[#de0b0b] text-3xl mr-4" /> {/* Icon for Health History */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#de0b0b]">Health History</h2>
        <p className="text-[#444444]">Your health trends over time will be displayed here.</p>
        <div className="bg-gray-200 p-4 mt-4 rounded-lg">
          <p className="text-[#444444]">More detailed health metrics could be shown here in graphs or charts.</p>
        </div>
      </div>
    </div>
  );
}
