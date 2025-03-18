import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setIsLoggedIn(true);
      setUserRole(userData.role);
      
      // Set default authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.status === 'success') {
        const { token, data } = response.data;
        const userData = data.user;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set default authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setCurrentUser(userData);
        setIsLoggedIn(true);
        setUserRole(userData.role);
        
        toast.success('Successfully logged in!');
        return { success: true, userData };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);

      if (response.data.status === 'success') {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUserRole(null);
    toast.success('Successfully logged out');
  };

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);

      if (response.data.status === 'success') {
        toast.success('Email verified successfully! You can now log in.');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email verification failed');
      return { success: false, error: error.response?.data?.message || 'Email verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      if (response.data.status === 'success') {
        toast.success('Password reset link sent to your email!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
      return { success: false, error: error.response?.data?.message || 'Failed to send reset link' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      const response = await axios.patch(`http://localhost:5000/api/auth/reset-password/${token}`, { password });

      if (response.data.status === 'success') {
        toast.success('Password reset successful! You can now log in with your new password.');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
      return { success: false, error: error.response?.data?.message || 'Password reset failed' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isLoggedIn,
        userRole,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);