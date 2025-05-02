'use client';
import { FaHistory } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const PastConsultations = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Date not available';
      }
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchPastAppointments = async () => {
      try {
        setLoading(true);
        
        if (!userId) {
          console.error('No user ID provided');
          return;
        }

        console.log('Fetching appointments for user:', userId);
        
        // First try a simple query without date filter
        const testQuery = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .limit(5);

        console.log('Test query results:', testQuery.data);

        if (testQuery.error) {
          throw testQuery.error;
        }

        // Now try with date filter
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            consultation_id,
            user_id,
            appointment_date,
            appointment_type,
            facility,
            status,
            appointment_facility_address
          `)
          .eq('user_id', userId)
          .eq('status', 'completed')
          .lt('appointment_date', now)
          .order('appointment_date', { ascending: false });

        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            code: error.code
          });
          throw error;
        }

        console.log('Fetched appointments:', data);
        setAppointments(data || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError(err.message || 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchPastAppointments();
  }, [userId]);

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center">
          <FaHistory className="mr-2 text-xl" />
          Past Appointments
        </h2>
        <p>Loading your appointment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center">
          <FaHistory className="mr-2 text-xl" />
          Past Appointments
        </h2>
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          <p className="font-medium">Error loading appointments:</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center">
          <FaHistory className="mr-2 text-xl" />
          Past Appointments
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">You don't have any past appointments yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Completed appointments will appear here automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-[#003366] mb-6 flex items-center">
        <FaHistory className="mr-2 text-xl" />
        Past Appointments
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointment) => (
          <div 
            key={appointment.consultation_id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(appointment.appointment_date)}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="font-medium">{appointment.appointment_type}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">Facility</p>
                  <p className="font-medium">{appointment.facility}</p>
                  {appointment.appointment_facility_address && (
                    <p className="text-sm text-gray-500 mt-1">
                      {appointment.appointment_facility_address}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  View Consultation Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastConsultations;