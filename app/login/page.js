'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar'; // Import the Navbar component
import { useRouter } from 'next/navigation'; // For redirecting after successful login

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Make the POST request to the backend for login
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token in localStorage
        localStorage.setItem('token', data.access_token);
        alert('Login successful!');
        router.push('/dashboard');  // Redirect to the dashboard page
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#003366] via-[#00509d] to-[#cfe2f3] min-h-screen flex items-center justify-center">
      <Navbar /> {/* Use the Navbar component */}
      
      <div className="flex justify-between items-center w-full max-w-screen-xl px-8 py-16">
        <div className="flex-1 text-white">
          <h2 className="text-6xl font-bold mb-7">Welcome Back to TrustScan</h2>
          <p className="text-2xl mb-4">Log in to your account to explore and take advantage of our features.</p>
          <p className="text-md">Don’t have an account yet? <a href="/signup" className="underline hover:text-blue-700">Sign up here</a></p>
        </div>

        <div className="flex-1 bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#003366]">Login to Your Account</h2>

          {/* Display error message */}
          {error && <p className="text-blue-500 text-sm text-center mb-4">{error}</p>}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4 relative">
              <label htmlFor="email" className="block text-sm font-medium text-[#003366]">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] pl-10"
              />
              <i className="absolute top-3 left-3 text-gray-400 fas fa-envelope"></i> {/* Email icon */}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-[#003366]">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] pl-10"
              />
              <i className="absolute top-3 left-3 text-gray-400 fas fa-lock"></i> {/* Lock icon */}
            </div>

            <div className="mb-4 text-center">
              <button type="submit" className="w-full bg-[#003366] text-white py-3 rounded-md shadow-md hover:bg-blue-700 transition transform hover:scale-105">
                {loading ? 'Processing...' : 'Login'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <a href="/forgot-password" className="text-sm text-[#003366] hover:text-blue-700">Forgot Password?</a>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm">Don’t have an account? <a href="/signup" className="text-[#003366] hover:text-blue-700">Sign up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
