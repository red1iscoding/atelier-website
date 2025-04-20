'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaUserMd, FaVideo, FaArrowLeft } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CreateAppointment = () => {
  const router = useRouter();
  const [consultationType, setConsultationType] = useState('');
  const [facility, setFacility] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const facilities = [
    { 
      name: 'CLINIQUE AVICENNE CPMA Constantine', 
      address: 'Quartier Bentchikou, 01 Cité, RN133 25000, Algeria',
      image: '/clinic-1.jpg'
    },
    { 
      name: 'Clinique Internationale Constantine', 
      address: 'K03, UV 07, 25000, Algeria',
      image: '/clinic-2.jpg'
    },
    { 
      name: 'CIME Ennardjess Dr NAMOUS', 
      address: '8HWX+FQ7, Av. Kadour Boumedous, Constantine, Algeria',
      image: '/clinic-3.jpg'
    },
    { 
      name: 'Centre de diagnostic El Hoceini', 
      address: '9J75+75V, Rue Petit, Constantine, Algeria',
      image: '/clinic-4.jpg'
    },
  ];

  const handlePay = () => {
    if (!consultationType || !facility || !date || !time) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(date);
    const selectedDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${time}`);
    const timeDifference = selectedDateTime - currentDate;
    const hoursDifference = timeDifference / (1000 * 3600);

    if (hoursDifference < 24) {
      setErrorMessage('Appointments must be booked at least 24 hours in advance.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const fullPrice = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
      const upfrontPayment = Math.round(fullPrice * 0.2);

      const appointmentDetails = {
        consultationType,
        facility,
        date: selectedDate.toISOString(),
        time,
        fullPrice,
        upfrontPayment,
        facilityAddress: facilities.find(f => f.name === facility)?.address || '',
        facilityImage: facilities.find(f => f.name === facility)?.image || ''
      };

      const encodedDetails = encodeURIComponent(JSON.stringify(appointmentDetails));
      router.push(`/consultations/payment?details=${encodedDetails}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Consultations
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-6 flex items-center">
              <FaCalendarAlt className="mr-3 text-xl" />
              Book Your Consultation
            </h2>

            {errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Consultation Type */}
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Consultation Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${consultationType === 'Video Call' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    onClick={() => setConsultationType('Video Call')}
                  >
                    <FaVideo className="text-2xl mb-2 text-blue-600" />
                    <span className="font-medium">Video Consultation</span>
                    <span className="text-sm text-gray-500 mt-1">From anywhere</span>
                  </button>
                  <button
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${consultationType === 'In-Person' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                    onClick={() => setConsultationType('In-Person')}
                  >
                    <FaUserMd className="text-2xl mb-2 text-green-600" />
                    <span className="font-medium">In-Person Consultation</span>
                    <span className="text-sm text-gray-500 mt-1">At selected facility</span>
                  </button>
                </div>
              </div>

              {/* Facility Selection */}
              {consultationType === 'In-Person' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">2. Select Facility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facilities.map((facilityOption, index) => (
                      <div 
                        key={index} 
                        className={`border-2 rounded-lg overflow-hidden transition-all ${facility === facilityOption.name ? 'border-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        <div className="h-32 bg-gray-200 overflow-hidden">
                          <img 
                            src={facilityOption.image} 
                            alt={facilityOption.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900">{facilityOption.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{facilityOption.address}</p>
                          <button
                            onClick={() => setFacility(facilityOption.name)}
                            className={`mt-3 w-full py-2 px-4 rounded-lg ${facility === facilityOption.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                          >
                            {facility === facilityOption.name ? 'Selected' : 'Select Facility'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">3. Select Date</h3>
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholderText="Choose a date"
                    calendarClassName="shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">4. Select Time</h3>
                  <input
                    type="time"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    min="08:00"
                    max="18:00"
                  />
                  <p className="text-sm text-gray-500 mt-2">Available between 8:00 AM - 6:00 PM</p>
                </div>
              </div>

              {/* Payment Button */}
              <div className="pt-4">
                <button
                  onClick={handlePay}
                  disabled={isLoading}
                  className={`w-full py-3 px-6 bg-[#003366] text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex justify-center items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;