import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UpcomingAppointments from "./UpcomingAppointments";
import PastConsultations from "./PastConsultations";
import ScheduleConsultation from "./ScheduleConsultation";
import ConsultationNotifications from "./ConsultationNotifications";

import { FaUserMd } from 'react-icons/fa';  // Import the icon

const ConsultationPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <Navbar />
          <div className="mt-6">
            <h1 className="text-2xl font-bold flex items-center">
              <FaUserMd className="mr-2 text-xl" />
              Your Consultation Dashboard
            </h1>

            {/* Upcoming Appointments */}
            <UpcomingAppointments />

            {/* Past Consultations */}
            <PastConsultations />

            {/* Schedule Consultation Button */}
            <ScheduleConsultation />

            {/* Notifications and Reminders */}
            <ConsultationNotifications />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultationPage;
