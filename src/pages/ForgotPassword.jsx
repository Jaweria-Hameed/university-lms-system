// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake email send
    setMessage('Password reset link sent to ' + email);
    setTimeout(() => navigate('/'), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </button>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}
