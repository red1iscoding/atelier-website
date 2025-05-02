'use client'; // For client-side navigation

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UpcomingAppointments from "./UpcomingAppointments";
import PastConsultations from "./PastConsultations";
import ScheduleConsultation from "./ScheduleConsultation";
import ConsultationNotifications from "./ConsultationNotifications";
import { FaUserMd } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const ConsultationPage = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user ID from session storage when component mounts
    const id = sessionStorage.getItem('user_id');
    setUserId(id);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex flex-col min-h-screen bg-white text-gray-800">Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-gray-800">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Please log in to view appointments</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <Navbar />
          <div className="mt-6">
            <h1 className="text-2xl font-bold flex items-center">
              <FaUserMd className="mr-2 text-xl" />
              Your Appointment Dashboard
            </h1>

            {/* Upcoming Appointments */}
            <UpcomingAppointments userId={userId} />

            {/* Past Consultations */}
            <PastConsultations userId={userId} />

            {/* Schedule Consultation Button */}
            <ScheduleConsultation userId={userId} />

           
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultationPage;