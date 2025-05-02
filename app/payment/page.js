'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPaypal, FaCheckCircle, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State initialization
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dahabia card details state
  const [dahabiaDetails, setDahabiaDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // PayPal details state
  const [paypalDetails, setPaypalDetails] = useState({
    email: '',
    password: ''
  });

  // Extract appointment details from URL
  useEffect(() => {
    const details = searchParams.get('details');
    if (details) {
      try {
        const parsedDetails = JSON.parse(decodeURIComponent(details));
        if (!parsedDetails.userId) {
          throw new Error('User ID missing');
        }
        setAppointmentDetails(parsedDetails);
      } catch (e) {
        console.error('Error parsing details:', e);
        setError('Invalid appointment data');
        router.push('/consultations/create-appointment');
      }
    } else {
      router.push('/consultations/create-appointment');
    }
  }, [searchParams, router]);

  const handleDahabiaChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setDahabiaDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate' && value.length === 2 && !value.includes('/')) {
      setDahabiaDetails(prev => ({
        ...prev,
        [name]: value + '/'
      }));
      return;
    }

    setDahabiaDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaypalChange = (e) => {
    const { name, value } = e.target;
    setPaypalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDahabiaFields = () => {
    const cardNumberValid = dahabiaDetails.cardNumber.replace(/\s/g, '').length === 16;
    const expiryValid = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(dahabiaDetails.expiryDate);
    const cvvValid = dahabiaDetails.cvv.length === 3;
    const nameValid = dahabiaDetails.cardholderName.trim().length > 0;
    
    return cardNumberValid && expiryValid && cvvValid && nameValid;
  };

  const validatePaypalFields = () => {
    return (
      paypalDetails.email.includes('@') && 
      paypalDetails.password.length >= 6
    );
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!appointmentDetails) {
      setError('Appointment details missing');
      return;
    }

    // Validate payment method fields
    if (paymentMethod === 'dahabia' && !validateDahabiaFields()) {
      setError('Please fill all Dahabia card details correctly');
      return;
    }

    if (paymentMethod === 'paypal' && !validatePaypalFields()) {
      setError('Please enter valid PayPal credentials');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Combine date and time into a single timestamp
      const appointmentDateTime = new Date(
        `${appointmentDetails.date.split('T')[0]}T${appointmentDetails.time}`
      ).toISOString();

      // Insert into Supabase
      const { data, error: supabaseError } = await supabase
        .from('appointments')
        .insert([{
          user_id: appointmentDetails.userId,
          appointment_type: appointmentDetails.consultationType,
          facility: appointmentDetails.facility,
          appointment_date: appointmentDateTime,
          status: 'pending',
          payment_status: 'paid',
          notes: '',
          appointment_facility_address: appointmentDetails.facilityAddress,
          appointment_facility_image: appointmentDetails.facilityImage,
          appointment_full_price: appointmentDetails.fullPrice,
          appointment_upfront_payment: appointmentDetails.upfrontPayment,
          created_at: new Date().toISOString(),
          appointment_updated_at: new Date().toISOString(),
          appointment_time: appointmentDateTime,
          appointment_reminder_time: new Date(
            new Date(appointmentDateTime).getTime() - (24 * 60 * 60 * 1000)
          ).toISOString()
        }])
        .select();

      if (supabaseError) throw supabaseError;

      // Success - show confirmation
      setPaymentSuccess(true);
      router.push(`/payment/success?ref=${data[0].consultation_id}`);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!appointmentDetails) {
    return <div className="p-4">Loading appointment details...</div>;
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
          <button
            onClick={() => router.push('/consultations')}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View My Appointments
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = appointmentDetails.date 
    ? new Date(appointmentDetails.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const remainingPayment = appointmentDetails.fullPrice - appointmentDetails.upfrontPayment;

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

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="space-y-4">
                  {/* Dahabia Card Option */}
                  <button
                    type="button"
                    className={`w-full p-4 rounded-lg border-2 flex items-center ${paymentMethod === 'dahabia' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'}`}
                    onClick={() => setPaymentMethod('dahabia')}
                  >
                    <FaCreditCard className="text-xl mr-3 text-yellow-600" />
                    <span className="font-medium">Dahabia Card</span>
                  </button>

                  {paymentMethod === 'dahabia' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={dahabiaDetails.cardNumber}
                          onChange={handleDahabiaChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          inputMode="numeric"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={dahabiaDetails.expiryDate}
                            onChange={handleDahabiaChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={dahabiaDetails.cvv}
                            onChange={handleDahabiaChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                            placeholder="123"
                            maxLength={3}
                            inputMode="numeric"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={dahabiaDetails.cardholderName}
                          onChange={handleDahabiaChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Name on card"
                        />
                      </div>
                    </div>
                  )}

                  {/* PayPal Option */}
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
                          value={paypalDetails.email}
                          onChange={handlePaypalChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={paypalDetails.password}
                          onChange={handlePaypalChange}
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
                onClick={handlePayment}
                disabled={isProcessing || !paymentMethod || 
                  (paymentMethod === 'dahabia' && !validateDahabiaFields()) ||
                  (paymentMethod === 'paypal' && !validatePaypalFields())
                }
                className={`w-full py-3 px-6 bg-[#003366] text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex justify-center items-center ${
                  isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                } ${
                  !paymentMethod || 
                  (paymentMethod === 'dahabia' && !validateDahabiaFields()) ||
                  (paymentMethod === 'paypal' && !validatePaypalFields())
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isProcessing ? (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;