'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';

function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      setMessage('');
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to process your request');
      } else {
        setMessage(data.message || 'If an account exists with this email, you will receive password reset instructions.');
        setEmail('');
      }
    } catch (error) {
      setError('An error occurred while processing your request');
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navigation />
      <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Reset your password
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
} 