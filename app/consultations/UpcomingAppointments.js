'use client'; // For client-side navigation

import { FaClock } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust import path as needed


const UpcomingAppointments = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define formatDate function inside the component
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        setLoading(true);
        
        if (!userId) {
          throw new Error("No user ID provided");
        }

        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'pending')
          .gte('appointment_date', now)
          .order('appointment_date', { ascending: true });

        if (error) throw error;

        setAppointments(data || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUpcomingAppointments();
    }
  }, [userId]);

  if (loading) {
    return <div className="mt-6">Loading appointments...</div>;
  }

  if (error) {
    return <div className="mt-6 text-red-500">Error: {error}</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center">
          <FaClock className="mr-2 text-xl" />
          Upcoming Appointments
        </h2>
        <p className="text-gray-500">No upcoming appointments found.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center">
        <FaClock className="mr-2 text-xl" />
        Upcoming Appointments
      </h2>

      <div className="flex flex-wrap gap-6">
        {appointments.map((appointment) => (
          <div key={appointment.consultation_id} className="bg-white rounded-xl shadow-md w-full max-w-sm p-6">
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(appointment.appointment_date)} {/* Now properly defined */}
              </p>
            </div>

            {/* Rest of your component remains the same */}
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Appointment Type</p>
              <p className="text-lg font-semibold text-gray-900">
                {appointment.appointment_type}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-sm">Facility</p>
              <p className="text-lg font-semibold text-gray-900">
                {appointment.facility}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-sm">Status</p>
              <p className="text-lg font-semibold text-yellow-500">
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </p>
            </div>

            <div className="flex justify-between space-x-4">
              <button className="text-[#003366] hover:bg-blue-100 py-2 px-4 rounded-full border border-[#003366] transition-all duration-200">
                Cancel
              </button>
              <button className="text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-full border border-blue-600 transition-all duration-200">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;