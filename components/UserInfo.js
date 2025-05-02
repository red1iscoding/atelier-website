import { FaUser, FaCalendarAlt, FaPhone, FaVenusMars, FaCreditCard } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UserInfo() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = sessionStorage.getItem('user_email');
        if (!userEmail) throw new Error('No user session found');

        const { data, error } = await supabase
          .from('users')
          .select(`
            full_name,
            subscription_plan,
            payment_status,
            unlimited_scans,
            gender,
            date_of_birth,
            phone_number,
            created_at
          `)
          .eq('email', userEmail)
          .single();

        if (error) throw error;
        if (!data) throw new Error('User not found');

        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="mb-8 p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="mb-8 p-4 border border-red-200 rounded-lg text-red-700">
        Error loading user data. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-black mb-4">
        Welcome, {userData.full_name || 'User'}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section with Shadow */}
        <div className="p-4 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-black mb-3 flex items-center">
            <FaUser className="mr-2 text-[#003366]" /> Profile Information
          </h2>
          <div className="space-y-3 text-black">
            <p className="flex items-center">
              <FaVenusMars className="text-[#003366] mr-2" />
              <span className="font-medium">Gender:</span> {userData.gender || 'Not specified'}
            </p>
            <p className="flex items-center">
              <FaCalendarAlt className="text-[#003366] mr-2" />
              <span className="font-medium">Date of Birth:</span> {formatDate(userData.date_of_birth)}
            </p>
            <p className="flex items-center">
              <FaPhone className="text-[#003366] mr-2" />
              <span className="font-medium">Phone:</span> {userData.phone_number || 'Not provided'}
            </p>
            <p>
              <span className="font-medium">Member Since:</span> {formatDate(userData.created_at)}
            </p>
          </div>
        </div>

        {/* Subscription Section with Shadow */}
        <div className="p-4 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-black mb-3 flex items-center">
            <FaCreditCard className="mr-2 text-[#003366]" /> Subscription Details
          </h2>
          <div className="space-y-3 text-black">
            <p>
              <span className="font-medium">Plan:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                userData.subscription_plan === 'premium' 
                  ? 'text-blue-800' 
                  : 'text-gray-800'
              }`}>
                {userData.subscription_plan || 'Not subscribed'}
              </span>
            </p>
            <p>
              <span className="font-medium">Payment Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                userData.payment_status === 'paid' 
                  ? 'text-green-800' 
                  : userData.payment_status === 'pending'
                  ? 'text-yellow-800'
                  : 'text-gray-800'
              }`}>
                {userData.payment_status || 'Unknown'}
              </span>
            </p>
            <p>
              <span className="font-medium">Scan Access:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                userData.unlimited_scans 
                  ? 'text-green-800' 
                  : 'text-gray-800'
              }`}>
                {userData.unlimited_scans ? 'Unlimited' : 'Limited'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}