import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail, loading } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (token) {
        const result = await verifyEmail(token);
        setVerificationStatus(result?.success ? 'success' : 'error');
      } else {
        setVerificationStatus('error');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300">
        <div className="p-8">
          <div className="text-center mb-8">
            {verificationStatus === 'verifying' && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
            )}
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {verificationStatus === 'verifying' && 'Verifying your email...'}
              {verificationStatus === 'success' && 'Email Verified!'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              {verificationStatus === 'verifying' && 'Please wait while we verify your email address.'}
              {verificationStatus === 'success' && 'Your email has been successfully verified. You can now log in to your account.'}
              {verificationStatus === 'error' && 'We could not verify your email. The verification link may be invalid or expired.'}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            {verificationStatus === 'success' && (
              <Link
                to="/login"
                className="btn-primary"
              >
                Sign in
              </Link>
            )}
            
            {verificationStatus === 'error' && (
              <div className="space-y-4">
                <Link
                  to="/signup"
                  className="btn-primary block text-center"
                >
                  Sign up again
                </Link>
                <Link
                  to="/"
                  className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;