'use client';  // Ensures it's a client component

import Navbar from './Navbar';  // Correct import path
import Footer from './Footer';  // Correct import path
import { useState, useEffect } from 'react';
import { FaUserAlt, FaCalendarCheck, FaFileMedical, FaChartLine } from 'react-icons/fa';  // Import icons

const AdminDashboard = () => {
  // Fake data for now
  const [metrics, setMetrics] = useState({
    totalUsers: 250,
    activeConsultations: 50,
    totalScans: 180,
    recentActivity: [
      'New scan uploaded: 20th March 2025',
      'Consultation scheduled: 21st March 2025',
      'User registration: 22nd March 2025',
      'New scan uploaded: 23rd March 2025',
    ],
  });

  // Fake data for chart
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'User Sign-Ups',
        data: [50, 100, 150, 200, 250], // Fake user signup data
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      {/* Navbar */}
      <Navbar />

      <div className="flex-1 p-6 mt-20">
        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metrics Section */}
          <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
            <div className="flex items-center mb-4">
              <FaUserAlt className="text-red-600 mr-4 text-2xl" />
              <h3 className="text-lg font-semibold">Total Users</h3>
            </div>
            <p className="text-xl">{metrics.totalUsers}</p>
          </div>
          <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
            <div className="flex items-center mb-4">
              <FaCalendarCheck className="text-red-600 mr-4 text-2xl" />
              <h3 className="text-lg font-semibold">Active Consultations</h3>
            </div>
            <p className="text-xl">{metrics.activeConsultations}</p>
          </div>
          <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
            <div className="flex items-center mb-4">
              <FaFileMedical className="text-red-600 mr-4 text-2xl" />
              <h3 className="text-lg font-semibold">Total Scans</h3>
            </div>
            <p className="text-xl">{metrics.totalScans}</p>
          </div>
          <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <ul>
              {metrics.recentActivity.map((event, index) => (
                <li key={index} className="text-sm">{event}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Example Chart Section */}
        <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg mt-6">
          <div className="flex items-center mb-4">
            <FaChartLine className="text-red-600 mr-4 text-2xl" />
            <h3 className="text-lg font-semibold">User Sign-Ups Over Time</h3>
          </div>
          {/* Placeholder for the chart */}
          <div style={{ height: '300px', backgroundColor: '#333333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-center text-gray-600">Chart goes here</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
