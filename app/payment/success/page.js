'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
        <p className="mb-6">Your appointment has been confirmed</p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <p className="font-medium">Appointment ID: {appointmentId}</p>
          <p className="text-sm mt-2">
            A confirmation has been sent to your email
          </p>
        </div>

        <button
          onClick={() => router.push('/consultations/')}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View My Appointments
        </button>
      </div>
    </div>
  );
}