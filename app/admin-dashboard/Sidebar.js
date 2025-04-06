// components/Sidebar.js
import Link from 'next/link';
import { FaTachometerAlt, FaUserAlt, FaCalendarCheck, FaFileMedical, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';

export default function AdminSidebar() {
  return (
    <div className="w-1/4 bg-white p-8 min-h-screen border-r border-gray-200 shadow-lg">
      {/* Logo / Brand Name */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-[#de0b0b]">TrustScan</h1>
      </div>

      {/* Sidebar Menu */}
      <nav className="space-y-6">
        {/* Dashboard Button */}
        <Link href="/admin-dashboard" className="flex items-center text-lg text-gray-700 hover:bg-[#de0b0b] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaTachometerAlt className="mr-4 text-xl" />
          Dashboard
        </Link>

        {/* User Management Button */}
        <Link href="/admin-dashboard/user-management" className="flex items-center text-lg text-gray-700 hover:bg-[#de0b0b] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaUserAlt className="mr-4 text-xl" />
          User Management
        </Link>

        {/* Consultations Button */}
        <Link href="/admin-dashboard/consultations" className="flex items-center text-lg text-gray-700 hover:bg-[#de0b0b] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaCalendarCheck className="mr-4 text-xl" />
          Consultations
        </Link>

        {/* Scan Results Button */}
        <Link href="/admin-dashboard/scan-results" className="flex items-center text-lg text-gray-700 hover:bg-[#de0b0b] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaFileMedical className="mr-4 text-xl" />
          Scan Results
        </Link>

        {/* Notifications Button */}
        <Link href="/admin-dashboard/notifications" className="flex items-center text-lg text-gray-700 hover:bg-[#de0b0b] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaBell className="mr-4 text-xl" />
          Notifications
        </Link>

        {/* Settings Button */}
        <Link href="/admin-dashboard/settings" className="flex items-center text-lg text-gray-700 hover:bg-[#de0b0b] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaCog className="mr-4 text-xl" />
          Settings
        </Link>

        {/* Sign Out Button */}
        <Link href="/admin-dashboard/sign-out" className="flex items-center text-lg text-gray-700 hover:bg-[#de0b0b] hover:text-white py-3 px-6 rounded-lg transition duration-200">
          <FaSignOutAlt className="mr-4 text-xl" />
          Sign Out
        </Link>
      </nav>
    </div>
  );
}
