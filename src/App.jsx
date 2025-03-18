import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Admissions from './pages/Admissions';
import Results from './pages/Results';
import Faculty from './pages/Faculty';
import Gallery from './pages/Gallery';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Fees from './pages/Fees';
import Calendar from './pages/Calendar';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ForgotPassword from './auth/ForgotPassword';
import VerifyEmail from './auth/VerifyEmail';
import ResetPassword from './auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isLoggedIn, userRole } = useAuth();

  const getDashboardComponent = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } 
          />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/fees" 
            element={
              <ProtectedRoute>
                <Fees />
              </ProtectedRoute>
            } 
          />
          <Route path="/calendar" element={<Calendar />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {getDashboardComponent()}
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;