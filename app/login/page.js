'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { verifyPassword } from '../../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Find user by email (case-insensitive)
      const { data: user, error: findError } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email.trim())
        .single();

      if (findError || !user) {
        throw new Error('Invalid email or password');
      }

      // 2. Verify hashed password
      const isPasswordValid = await verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // 3. Login successful
      sessionStorage.setItem('user_email', user.email);
      localStorage.setItem('user_id', user.user_id);  
      sessionStorage.setItem('user_id', user.user_id);
      router.push('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#003366] via-[#00509d] to-[#cfe2f3] min-h-screen flex items-center justify-center">
      <Navbar />
      
      <div className="flex justify-between items-center w-full max-w-screen-xl px-8 py-16">
        <div className="flex-1 text-white">
          <h2 className="text-6xl font-bold mb-7">Welcome Back to TrustScan</h2>
          <p className="text-2xl mb-4">Log in to your account to explore and take advantage of our features.</p>
          <p className="text-md">Don't have an account yet? <a href="/signup" className="underline hover:text-blue-700">Sign up here</a></p>
        </div>

        <div className="flex-1 bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#003366]">Login to Your Account</h2>

          {/* Display error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4 relative">
              <label htmlFor="email" className="block text-sm font-medium text-[#003366]">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] pl-10"
              />
              <i className="absolute top-3 left-3 text-gray-400 fas fa-envelope"></i>
            </div>
            
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-[#003366]">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#003366] focus:border-[#003366] pl-10"
              />
              <i className="absolute top-3 left-3 text-gray-400 fas fa-lock"></i>
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
                    Logging in...
                  </span>
                ) : 'Login'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <a href="/forgot-password" className="text-sm text-[#003366] hover:text-blue-700">Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}