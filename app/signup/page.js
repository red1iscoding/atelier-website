'use client'; // This ensures it's a client-side component

import { useState } from 'react';
import Navbar from '../../components/Navbar'; // Import Navbar component
import { useRouter } from 'next/navigation'; // For redirection after successful signup

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
  const router = useRouter(); // Used for navigation

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

    // Set loading state while submitting
    setLoading(true);
    setError('');

    // Prepare the data to send to the backend
    const userData = {
      full_name: fullName,
      gender: gender,
      dob: dob,
      email: email,
      phone: phone,
      password: password,
      subscription_plan: subscription,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect the user to the login page after successful signup
        alert('Sign-up successful!');
        router.push('/login');  // Redirect to the login page
      } else {
        setError(data.detail || 'Signup failed, please try again.');
      }
    } catch (err) {
      // Handle any error that occurs during the fetch call
      setError('An error occurred during signup');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/signupbg.jpg')",  // Correct path to your image inside the public folder
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
          background: 'rgba(255, 255, 255, 0.6)', // Adjust opacity to control image visibility
          zIndex: -1, // To place the gradient behind the content
        }}
      ></div>

      <Navbar /> {/* Use the Navbar component */}
      
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
          {error && <p className="text-blue-500 text-sm text-center mb-4">{error}</p>}

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
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#003366]'} text-white py-3 rounded-md shadow-md hover:bg-blue-700 transition transform hover:scale-105`}
              >
                {loading ? 'Processing...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
