import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setError('');
    
    const result = await resetPassword(token, password);
    
    if (result && result.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300">
        <div className="p-8">
          <div className="text-center mb-8">
            <Lock className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>

          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter new password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirm new password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary relative"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="ml-2">Resetting password...</span>
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-green-800">Your password has been reset successfully!</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You will be redirected to the login page shortly.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center">
            <Link
              to="/login"
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;