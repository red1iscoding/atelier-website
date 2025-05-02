'use client';

import Navbar from '../Navbar';
import { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch appointments from Supabase
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*, users(full_name, email)')
        .order('appointment_date', { ascending: true });

      if (searchTerm) {
        query = query.or(
          `users.full_name.ilike.%${searchTerm}%,users.email.ilike.%${searchTerm}%,facility.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [searchTerm]);

  const handleReschedule = (appointment) => {
    setIsRescheduling(true);
    setSelectedAppointment(appointment);
    setNewDate(appointment.appointment_date);
  };

  const handleDateChange = (e) => {
    setNewDate(e.target.value);
  };

  const saveReschedule = async () => {
    if (!selectedAppointment) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          appointment_date: newDate,
          appointment_updated_at: new Date().toISOString()
        })
        .eq('consultation_id', selectedAppointment.consultation_id);

      if (error) throw error;
      fetchAppointments();
      setIsRescheduling(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ 
            status: 'cancelled',
            appointment_updated_at: new Date().toISOString()
          })
          .eq('consultation_id', appointmentId);

        if (error) throw error;
        fetchAppointments();
      } catch (error) {
        console.error('Error canceling appointment:', error);
      }
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewing(true);
  };

  const closeViewModal = () => {
    setIsViewing(false);
    setSelectedAppointment(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-DZ', {  // Changed to Algerian locale
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,  // Dinar typically doesn't use fractions
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  if (loading) return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20 flex justify-center items-center">
        <p>Loading appointments...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex-1 p-6 mt-20">
        <h2 className="text-3xl font-semibold mb-6">Appointments Management</h2>

        {/* Search Bar Section */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center w-1/2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full p-3 pl-10 pr-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-gray-800 dark:bg-gray-900 p-4 rounded shadow-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-700 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left text-white">ID</th>
                <th className="p-4 text-left text-white">Patient</th>
                <th className="p-4 text-left text-white">Date & Time</th>
                <th className="p-4 text-left text-white">Type</th>
                <th className="p-4 text-left text-white">Facility</th>
                <th className="p-4 text-left text-white">Price</th>
                <th className="p-4 text-left text-white">Status</th>
                <th className="p-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.consultation_id} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-300">
                  <td className="p-4 text-white">{appointment.consultation_id}</td>
                  <td className="p-4 text-white">
                    <div className="font-medium">{appointment.users?.full_name}</div>
                    <div className="text-sm text-gray-400">{appointment.users?.email}</div>
                  </td>
                  <td className="p-4 text-white">
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                    <div className="text-sm text-gray-400">
                      {new Date(appointment.appointment_date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4 text-white capitalize">
                    {appointment.appointment_type?.replace('_', ' ')}
                  </td>
                  <td className="p-4 text-white">
                    {appointment.facility || 'N/A'}
                    {appointment.appointment_facility_address && (
                      <div className="text-sm text-gray-400">
                        {appointment.appointment_facility_address}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-white">
  <div className="flex items-center gap-1">
    <FaMoneyBillWave className="text-green-400" />
    {formatCurrency(appointment.appointment_full_price)} DZD {/* Added DZD suffix */}
  </div>
  {appointment.appointment_upfront_payment > 0 && (
    <div className="text-sm text-gray-400">
      Paid: {formatCurrency(appointment.appointment_upfront_payment)} DZD {/* Added DZD suffix */}
    </div>
  )}
</td>
                  <td className={`p-4 ${
                    appointment.status === 'completed' ? 'text-green-500' :
                    appointment.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    <span className="capitalize">{appointment.status}</span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300"
                      onClick={() => handleViewDetails(appointment)}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleReschedule(appointment)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-all duration-300"
                      title="Reschedule"
                      disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleCancel(appointment.consultation_id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all duration-300"
                      title="Cancel"
                      disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reschedule Modal */}
        {isRescheduling && selectedAppointment && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold text-white mb-4">Reschedule Appointment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Patient</label>
                  <div className="p-2 bg-gray-800 rounded text-white">
                    {selectedAppointment.users?.full_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Date</label>
                  <div className="p-2 bg-gray-800 rounded text-white">
                    {new Date(selectedAppointment.appointment_date).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">New Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={handleDateChange}
                    className="p-2 w-full bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  onClick={() => setIsRescheduling(false)} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveReschedule} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {isViewing && selectedAppointment && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h3 className="text-2xl font-semibold text-white mb-4">Appointment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Appointment ID</p>
                    <p className="text-white font-medium">{selectedAppointment.consultation_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Patient</p>
                    <p className="text-white font-medium">{selectedAppointment.users?.full_name}</p>
                    <p className="text-gray-400 text-sm">{selectedAppointment.users?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Scheduled Date</p>
                    <p className="text-white">
                      {new Date(selectedAppointment.appointment_date).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Appointment Type</p>
                    <p className="text-white capitalize">
                      {selectedAppointment.appointment_type?.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Facility</p>
                    <p className="text-white">{selectedAppointment.facility || 'N/A'}</p>
                    {selectedAppointment.appointment_facility_address && (
                      <p className="text-gray-400 text-sm">
                        {selectedAppointment.appointment_facility_address}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <p className={`capitalize ${
                      selectedAppointment.status === 'completed' ? 'text-green-500' :
                      selectedAppointment.status === 'cancelled' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {selectedAppointment.status}
                    </p>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Full Price</p>
                      <p className="text-white font-medium">
                        {formatCurrency(selectedAppointment.appointment_full_price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Upfront Payment</p>
                      <p className="text-white">
                        {formatCurrency(selectedAppointment.appointment_upfront_payment)}
                      </p>
                    </div>
                  </div>
                  
                  {selectedAppointment.notes && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Notes</p>
                      <p className="text-white bg-gray-800 p-3 rounded">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={closeViewModal} 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Section */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-white">Showing {appointments.length} appointments</span>
        </div>
      </div>
    </div>
  );
};

export default Appointments;