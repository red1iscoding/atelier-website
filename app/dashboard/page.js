'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import HealthMetrics from '../../components/HealthMetrics';
import Notifications from '../../components/Notifications';
import Footer from '../../components/Footer';
import UserInfo from '../../components/UserInfo';

export default function Dashboard() {
  const [user, setUser] = useState({
    fullName: 'Sarah Haddad', 
    subscriptionStatus: 'Premium',
    planExpiry: '2025-12-31',
    recentScanStatus: 'Awaiting Analysis',
  });
  
  const [loading, setLoading] = useState(false);  // No longer loading from backend
  const [error, setError] = useState('');

  // Simulate loading process (you can remove useEffect and this state if you want no loading)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a delay
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex pt-24 bg-white">
        <Sidebar />

        <div className="w-full p-8">
          <UserInfo user={user} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white shadow-lg rounded-lg flex items-center">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-[#003366]">AI Scan Results</h2>
                <p className="text-[#444444]">Status: {user.recentScanStatus}</p>
                <button className="mt-4 bg-[#003366] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                  View Recent Scan
                </button>
              </div>
            </div>
          </div>

          <HealthMetrics />
          <Notifications />
        </div>
      </div>
      <Footer />
    </>
  );
}
