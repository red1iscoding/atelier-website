'use client'; // Ensure this is at the top to mark the file as a client component

import { useState } from 'react';
import Link from 'next/link'; // Import next/link for client-side navigation
import { usePathname } from 'next/navigation'; // Hook to get the current pathname

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current URL path

  // Determine if we're on the admin dashboard page ("/admin-dashboard")
  const isAdminDashboardPage = pathname === "/admin-dashboard";

  return (
    <header className="bg-blue-800 dark:bg-gray-950 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center py-6">
        {/* Brand Name / Logo (clickable to home) */}
        <div className="text-2xl font-semibold text-white">
          <Link href="/admin-dashboard">TrustScan</Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="block lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation Links for Desktop */}
        <nav className={`space-x-8 hidden lg:flex ${isOpen ? 'block' : 'hidden'}`}>
          <Link href="/admin-dashboard" className={`text-gray-300 hover:text-white ${isAdminDashboardPage ? 'text-red-600' : ''}`}>
            Dashboard
          </Link>
          <Link href="/admin-dashboard/user-management" className="text-gray-300 hover:text-white">
            User Management
          </Link>
          <Link href="/admin-dashboard/consultations" className="text-gray-300 hover:text-white">
            Consultations
          </Link>
          <Link href="/admin-dashboard/scan-results" className="text-gray-300 hover:text-white">
            Scan Results
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="space-x-4">
          <Link href="/admin-dashboard/login" className="bg-transparent text-red-600 border border-red-600 py-2 px-6 rounded-full hover:bg-red-600 hover:text-white transition">
            Log Out
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-blue-800 dark:bg-gray-900`}>
        <nav className="flex flex-col items-center py-4">
          <Link href="/admin-dashboard" className={`text-gray-300 hover:text-white ${isAdminDashboardPage ? 'text-red-600' : ''}`}>
            Dashboard
          </Link>
          <Link href="/admin-dashboard/user-management" className="text-gray-300 hover:text-white py-2">
            User Management
          </Link>
          <Link href="/admin-dashboard/consultations" className="text-gray-300 hover:text-white py-2">
            Consultations
          </Link>
          <Link href="/admin-dashboard/scan-results" className="text-gray-300 hover:text-white py-2">
            Scan Results
          </Link>
        </nav>
      </div>
    </header>
  );
}
