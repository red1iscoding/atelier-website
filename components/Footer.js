// components/Footer.js

import Link from 'next/link'; // Import Link from next/link
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Import social icons

export default function Footer() {
  return (
    <footer className="bg-white py-16 mt-0 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-[#003366] mb-2">Stay Informed with TrustScan</h2> {/* Text updated to blue */}
          <p className="text-lg text-gray-600 mb-4">
            Join us for updates on early diagnosis and AI-powered healthcare solutions.
          </p>
          <Link href="/signup">
            <button className="px-8 py-4 bg-[#003366] text-white text-2xl font-semibold rounded-full hover:bg-blue-700 transition-all duration-300">
              Sign Up for Our Newsletter
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About TrustScan */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#003366] mb-4">About TrustScan</h3> {/* Text updated to blue */}
            <ul className="text-gray-600">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/features" className="hover:underline">Features</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* TrustScan Features */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#003366] mb-4">TrustScan Features</h3> {/* Text updated to blue */}
            <ul className="text-gray-600">
              <li><Link href="#" className="hover:underline">AI-Powered Diagnosis</Link></li>
              <li><Link href="#" className="hover:underline">Early Detection</Link></li>
              <li><Link href="#" className="hover:underline">Fast Results</Link></li>
              <li><Link href="#" className="hover:underline">Health Monitoring</Link></li>
            </ul>
          </div>

          {/* Blog & Resources */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#003366] mb-4">Blog & Resources</h3> {/* Text updated to blue */}
            <ul className="text-gray-600">
              <li><Link href="#" className="hover:underline">How AI is Revolutionizing Healthcare</Link></li>
              <li><Link href="#" className="hover:underline">The Future of Medical Diagnostics</Link></li>
              <li><Link href="#" className="hover:underline">Importance of Early Detection in Health</Link></li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#003366] mb-4">Follow Us</h3> {/* Text updated to blue */}
            <div className="flex justify-center space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-2xl text-gray-600 hover:text-blue-700" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl text-gray-600 hover:text-blue-700" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl text-gray-600 hover:text-blue-700" />
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="text-2xl text-gray-600 hover:text-blue-700" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} TrustScan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
