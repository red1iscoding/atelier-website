'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPaypal, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encodedDetails = searchParams.get('details');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    email: '',
    password: ''
  });

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Appointment details
  const [appointmentDetails, setAppointmentDetails] = useState({
    consultationType: '',
    facility: '',
    facilityAddress: '',
    facilityImage: '',
    date: '',
    time: '',
    fullPrice: 0,
    upfrontPayment: 0,
    userId: null
  });

  useEffect(() => {
    if (encodedDetails) {
      try {
        const decodedDetails = JSON.parse(decodeURIComponent(encodedDetails));
        // Ensure we have all required fields including random price
        if (!decodedDetails.fullPrice || !decodedDetails.upfrontPayment) {
          throw new Error('Missing price information');
        }
        setAppointmentDetails(decodedDetails);
      } catch (error) {
        console.error('Error parsing appointment details:', error);
        router.push('/consultations/create-appointment');
      }
    } else {
      router.push('/consultations/create-appointment');
    }
  }, [encodedDetails, router]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate payment method
    if (!paymentMethod) {
      setErrorMessage('Please select a payment method.');
      return;
    }
  
    // Validate payment details based on method
    if (paymentMethod === 'dahabia') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv || !paymentDetails.name) {
        setErrorMessage('Please fill in all Dahabia card details.');
        return;
      }
    } else if (paymentMethod === 'paypal') {
      if (!paymentDetails.email || !paymentDetails.password) {
        setErrorMessage('Please enter your PayPal email and password.');
        return;
      }
    }
  
    setErrorMessage('');
    setIsPaymentProcessing(true);
  
    try {
      // Get JWT token from storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }
  
      // 1. Create the consultation (appointment) in the database
      const consultationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token for authentication
        },
        body: JSON.stringify({
          consultation_type: appointmentDetails.consultationType,
          facility: appointmentDetails.facility,
          date: appointmentDetails.date,
          time: appointmentDetails.time,
          full_price: appointmentDetails.fullPrice,
          upfront_payment: appointmentDetails.upfrontPayment,
          facility_address: appointmentDetails.facilityAddress,
          status: 'pending_payment', // Initial status, payment will be handled later
        })
      });
  
      if (!consultationResponse.ok) {
        const errorData = await consultationResponse.json();
        throw new Error(errorData.detail || 'Failed to create consultation');
      }
  
      const consultationData = await consultationResponse.json();
      
      // Show success message and navigate
      setPaymentSuccess(true);
      alert('Appointment created successfully!');
      router.push('/consultations'); // Redirect to consultations page
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsPaymentProcessing(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formattedDate = appointmentDetails.date 
    ? new Date(appointmentDetails.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const remainingPayment = appointmentDetails.fullPrice - appointmentDetails.upfrontPayment;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4 flex justify-center">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Confirmed!</h2>
          
          <div className="text-left mb-6 space-y-2">
            <p><span className="font-medium">Type:</span> {appointmentDetails.consultationType}</p>
            <p><span className="font-medium">Facility:</span> {appointmentDetails.facility}</p>
            <p><span className="font-medium">Date:</span> {formattedDate}</p>
            <p><span className="font-medium">Time:</span> {appointmentDetails.time}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <p className="font-medium">Amount Paid: {appointmentDetails.upfrontPayment} DZD</p>
            <p className="text-sm text-gray-600">Remaining {remainingPayment} DZD to be paid at the facility</p>
            <p className="text-sm text-gray-600 mt-2">Payment Method: {paymentMethod === 'dahabia' ? 'Dahabia Card' : 'PayPal'}</p>
          </div>
          
          <button
            onClick={() => router.push('/consultations')}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <button 
          onClick={() => router.push('/consultations/create-appointment')}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Appointment
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">Complete Your Payment</h2>

            {errorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handlePayment}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="space-y-4">
                    <button
                      type="button"
                      className={`w-full p-4 rounded-lg border-2 flex items-center ${paymentMethod === 'dahabia' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}
                      onClick={() => setPaymentMethod('dahabia')}
                    >
                      <img 
                        src="/dahabia-logo.png" 
                        alt="Dahabia Card" 
                        className="w-6 h-6 mr-3 object-contain"
                      />
                      <span className="font-medium">Dahabia Card</span>
                    </button>

                    {paymentMethod === 'dahabia' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            name="name"
                            value={paymentDetails.name}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="Name on card"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="1234 5678 9012 3456"
                            maxLength={16}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="month"
                              name="expiry"
                              value={paymentDetails.expiry}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              value={paymentDetails.cvv}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              placeholder="123"
                              maxLength={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className={`w-full p-4 rounded-lg border-2 flex items-center ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => setPaymentMethod('paypal')}
                    >
                      <FaPaypal className="text-xl mr-3 text-blue-600" />
                      <span className="font-medium">PayPal</span>
                    </button>

                    {paymentMethod === 'paypal' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Email</label>
                          <input
                            type="email"
                            name="email"
                            value={paymentDetails.email}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your@email.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PayPal Password</label>
                          <input
                            type="password"
                            name="password"
                            value={paymentDetails.password}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {paymentMethod && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You'll be charged {appointmentDetails.upfrontPayment} DZD now. 
                        The remaining {remainingPayment} DZD will be paid at the facility.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Appointment Summary</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {appointmentDetails.facilityImage && (
                      <div className="h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={appointmentDetails.facilityImage}
                          alt={appointmentDetails.facility}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2">{appointmentDetails.consultationType} Consultation</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Facility</p>
                          <p className="font-medium">{appointmentDetails.facility}</p>
                          <p className="text-sm text-gray-600">{appointmentDetails.facilityAddress}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{formattedDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">{appointmentDetails.time}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Full Price:</span>
                          <span className="font-medium">{appointmentDetails.fullPrice} DZD</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Upfront Payment (20%):</span>
                          <span className="font-medium text-blue-600">{appointmentDetails.upfrontPayment} DZD</span>
                        </div>
                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
                          <span className="text-gray-600">Remaining (80%):</span>
                          <span className="font-medium">{remainingPayment} DZD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isPaymentProcessing || !paymentMethod}
                  className={`w-full py-3 px-6 bg-[#003366] text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex justify-center items-center ${isPaymentProcessing ? 'opacity-75 cursor-not-allowed' : ''} ${!paymentMethod ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isPaymentProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ${appointmentDetails.upfrontPayment} DZD Now`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;