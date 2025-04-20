// components/Sidebar.js
import Link from 'next/link';
import { FaTachometerAlt, FaFileMedical, FaCalendarCheck, FaUpload, FaHeartbeat, FaCog, FaSignOutAlt, FaBookOpen, FaBell } from 'react-icons/fa'; 

export default function Sidebar() {
  return (
    <div className="w-1/4 bg-white p-8 min-h-screen border-r border-gray-200 shadow-lg">
      {/* Logo / Brand Name */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#003366]">TrustScan</h1> {/* Changed to blue */}
      </div>

      {/* Sidebar Menu */}
      <nav className="space-y-6">
        {/* Dashboard Button */}
        <Link href="/dashboard" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaTachometerAlt className="mr-4 text-xl" />
          Dashboard
        </Link>

        {/* Consultations Button */}
        <Link href="/consultations" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaCalendarCheck className="mr-4 text-xl" />
          Appointments
        </Link>

        {/* Scan Results Button */}
        <Link href="/scan-results" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaFileMedical className="mr-4 text-xl" />
          Scan Results
        </Link>

        {/* Upload Scan Button */}
        <Link href="/upload-scan" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaUpload className="mr-4 text-xl" />
          Upload Scan
        </Link>

        {/* Health History Button */}
        <Link href="/health-history" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaHeartbeat className="mr-4 text-xl" />
          Health History
        </Link>

        {/* Notifications Button */}
        <Link href="/notifications" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaBell className="mr-4 text-xl" />
          Notifications
        </Link>

        {/* Educational Resources Button */}
        <Link href="/educational-resources" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaBookOpen className="mr-4 text-xl" />
          Educational Resources
        </Link>

        {/* Settings Button */}
        <Link href="/settings" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaCog className="mr-4 text-xl" />
          Settings
        </Link>

        {/* Sign Out Button */}
        <Link href="/sign-out" className="flex items-center text-lg text-gray-700 hover:bg-[#003366] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaSignOutAlt className="mr-4 text-xl" />
          Sign Out
        </Link>
      </nav>
    </div>
  );
}
