'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import HealthMetrics from '../../components/HealthMetrics';
import Notifications from '../../components/Notifications';
import Footer from '../../components/Footer';
import UserInfo from '../../components/UserInfo';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data with the token from backend
      fetch('http://127.0.0.1:8000/user-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error fetching user data');
          setLoading(false);
        });
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
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

          {/* Check if user data exists before rendering */}
          {user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 bg-white shadow-lg rounded-lg flex items-center">
                {/* Display user data dynamically */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#de0b0b]">AI Scan Results</h2>
                  <p className="text-[#444444]">Status: {user.recentScanStatus}</p>
                  <button className="mt-4 bg-[#de0b0b] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
                    View Recent Scan
                  </button>
                </div>
              </div>
              {/* Repeat for other dashboard sections */}
            </div>
          ) : (
            <div>No user data available.</div>
          )}

          <HealthMetrics />
          <Notifications />
        </div>
      </div>
      <Footer />
    </>
  );
}
