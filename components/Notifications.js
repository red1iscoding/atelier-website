// components/Notifications.js
import { FaBell } from 'react-icons/fa';

export default function Notifications() {
  return (
    <div className="p-6 mt-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#de0b0b]">
        <FaBell className="text-[#de0b0b] inline-block mr-2 text-xl" /> Notifications
      </h2> {/* Notification Icon */}
      <div className="space-y-4">
        {/* Notification 1 */}
        <div className="p-4 bg-[#f7f7f7] rounded-lg shadow-sm border-l-4 border-[#de0b0b]">
          <p className="text-[#444444]">Your recent scan is ready for review.</p>
        </div>

        {/* Notification 2 */}
        <div className="p-4 bg-[#f7f7f7] rounded-lg shadow-sm border-l-4 border-[#de0b0b]">
          <p className="text-[#444444]">Your consultation with Dr. Smith is scheduled for tomorrow.</p>
        </div>

        {/* Notification 3 */}
        <div className="p-4 bg-[#f7f7f7] rounded-lg shadow-sm border-l-4 border-[#de0b0b]">
          <p className="text-[#444444]">Your new health report is now available for download.</p>
        </div>
      </div>
    </div>
  );
}
