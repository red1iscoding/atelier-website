'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subscription, setSubscription] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Ensure terms and conditions are agreed
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Check if email already exists
      const { data: existingUser, error: lookupError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('This email is already registered');
      }

      // 2. Insert directly into users table (with plain text password for demo)
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          email,
          password, // Storing plain text password (for demo only)
          full_name: fullName,
          gender,
          date_of_birth: dob,
          phone_number: phone,
          subscription_plan: subscription,
          role: 'patient',
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Store user info and redirect
      sessionStorage.setItem('user_email', newUser.email);
      sessionStorage.setItem('user_id', newUser.user_id);
      localStorage.setItem('user_id', newUser.user_id);
      
      router.push('/dashboard');

    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/signupbg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      {/* Gradient overlay for the image */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.6)',
          zIndex: -1,
        }}
      ></div>

      <Navbar />
      
      {/* Main Flex Container */}
      <div className="flex justify-center items-center w-full max-w-screen-xl px-8 py-16">
        {/* Left Section: Background text in blue */}
        <div className="flex-1 p-8">
          <h1 className="text-6xl font-bold mb-4 text-[#003366]">Revolutionize Your Health</h1>
          <p className="text-2xl mb-4 text-[#003366]">
            Join TrustScan and harness the power of AI for personalized, life-changing diagnostics.
          </p>
          <p className="text-xl text-[#003366]">
            Experience a smarter, healthier future today.
          </p>
        </div>

        {/* Right Section with Sign-Up Card */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#003366]">Sign Up to TrustScan</h2>
          
          {/* Display error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Sign-Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-[#003366]">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium text-[#003366]">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800"
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="dob" className="block text-sm font-medium text-[#003366]">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[#003366]">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-[#003366]">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800"
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-[#003366]">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                minLength={6}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800"
                placeholder="Create a password"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#003366]">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800"
                placeholder="Confirm your password"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subscription" className="block text-sm font-medium text-[#003366]">Subscription Plan</label>
              <select
                id="subscription"
                value={subscription}
                onChange={(e) => setSubscription(e.target.value)}
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] text-gray-800"
              >
                <option value="">Select a subscription plan</option>
                <option value="basic">Basic Plan</option>
                <option value="premium">Premium Plan</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center text-sm text-[#003366]">
                <input 
                  type="checkbox" 
                  required 
                  checked={agreeTerms} 
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="mr-2"
                />
                I agree to the Terms and Conditions and Privacy Policy.
              </label>
            </div>

            <div className="mb-4 text-center">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-[#003366] text-white py-3 rounded-md shadow-md hover:bg-blue-700 transition ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}