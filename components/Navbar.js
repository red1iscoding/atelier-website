'use client'; // Ensure this is at the top to mark the file as a client component

import { useState } from 'react';
import Link from 'next/link'; // Import next/link for client-side navigation
import { usePathname } from 'next/navigation'; // Hook to get the current pathname

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current URL path

  // Determine if we're on the landing page ("/")
  const isHomePage = pathname === "/";

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center py-6">
        {/* Brand Name / Logo (clickable to home) */}
        <div className="text-2xl font-semibold text-[#003366]">
          <Link href="/">TrustScan</Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="block lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#003366] focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation Links for Desktop */}
        <nav className={`space-x-8 hidden lg:flex ${isOpen ? 'block' : 'hidden'}`}>
          <Link href="/" className={`text-gray-600 hover:text-gray-800 ${isHomePage ? 'text-[#003366]' : ''}`}>
            Home
          </Link>
          <a href="#features" className="text-gray-600 hover:text-gray-800">Features</a>
          <a href="#about" className="text-gray-600 hover:text-gray-800">About</a>
          <a href="#faq" className="text-gray-600 hover:text-gray-800">F.A.Q.</a>
        </nav>

        {/* Login / Sign Up Buttons */}
        <div className="space-x-4">
          <Link href="/login" className="bg-transparent text-[#003366] border border-[#003366] py-2 px-6 rounded-full hover:bg-[#003366] hover:text-white transition">
            Login
          </Link>
          <Link href="/signup" className="bg-[#003366] text-white py-2 px-6 rounded-full hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-white shadow-md`}>
        <nav className="flex flex-col items-center py-4">
          <Link href="/" className={`text-gray-600 hover:text-gray-800 ${isHomePage ? 'text-[#003366]' : ''}`}>
            Home
          </Link>
          <a href="#features" className="text-gray-600 hover:text-gray-800 py-2">Features</a>
          <a href="#about" className="text-gray-600 hover:text-gray-800 py-2">About</a>
          <a href="#faq" className="text-gray-600 hover:text-gray-800 py-2">F.A.Q.</a>
        </nav>
      </div>
    </header>
  );
}
