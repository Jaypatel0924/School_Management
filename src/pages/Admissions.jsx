// import React from 'react';
// import { ClipboardCheck, GraduationCap, FileText, Calendar } from 'lucide-react';

// const Admissions = () => {
//   return (
//     <div className="space-y-16 py-8">
//       {/* Hero Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">Admissions</h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           Join our vibrant community of learners and begin your journey towards academic excellence.
//         </p>
//       </section>

//       {/* Admission Process */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h2 className="text-3xl font-bold text-center mb-12">Admission Process</h2>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div className="text-center">
//             <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
//               <FileText className="h-12 w-12 text-indigo-600" />
//             </div>
//             <h3 className="text-xl font-semibold mb-4">1. Submit Application</h3>
//             <p className="text-gray-600">
//               Complete the online application form with required documents.
//             </p>
//           </div>
//           <div className="text-center">
//             <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
//               <ClipboardCheck className="h-12 w-12 text-indigo-600" />
//             </div>
//             <h3 className="text-xl font-semibold mb-4">2. Entrance Test</h3>
//             <p className="text-gray-600">
//               Take the entrance examination to assess academic readiness.
//             </p>
//           </div>
//           <div className="text-center">
//             <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
//               <Calendar className="h-12 w-12 text-indigo-600" />
//             </div>
//             <h3 className="text-xl font-semibold mb-4">3. Interview</h3>
//             <p className="text-gray-600">
//               Personal interview with student and parents.
//             </p>
//           </div>
//           <div className="text-center">
//             <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
//               <GraduationCap className="h-12 w-12 text-indigo-600" />
//             </div>
//             <h3 className="text-xl font-semibold mb-4">4. Enrollment</h3>
//             <p className="text-gray-600">
//               Complete enrollment process and welcome to our community!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Application Form */}
//       <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white p-8 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold mb-6">Application Form</h2>
//           <form className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="Enter first name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="Enter last name"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 className="input-field"
//                 placeholder="Enter email address"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Grade Applying For
//               </label>
//               <select className="input-field">
//                 <option>Select Grade</option>
//                 <option>Grade 8</option>
//                 <option>Grade 9</option>
//                 <option>Grade 10</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Message
//               </label>
//               <textarea
//                 className="input-field"
//                 rows={4}
//                 placeholder="Any additional information..."
//               ></textarea>
//             </div>
//             <button type="submit" className="btn-primary w-full">
//               Submit Application
//             </button>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Admissions;

import React, { useState } from 'react';
import { ClipboardCheck, GraduationCap, FileText, Calendar, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Admissions = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gradeApplying: 'Grade 8',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/admissions', formData);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        gradeApplying: 'Grade 8',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Admissions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our vibrant community of learners and begin your journey towards academic excellence.
        </p>
      </section>

      {/* Admission Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Admission Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">1. Submit Application</h3>
            <p className="text-gray-600">
              Complete the online application form with required documents.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <ClipboardCheck className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">2. Entrance Test</h3>
            <p className="text-gray-600">
              Take the entrance examination to assess academic readiness.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">3. Interview</h3>
            <p className="text-gray-600">
              Personal interview with student and parents.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">4. Enrollment</h3>
            <p className="text-gray-600">
              Complete enrollment process and welcome to our community!
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {submitted ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in Modern Academy. We will review your application and contact you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Application Form</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Applying For
                  </label>
                  <select
                    name="gradeApplying"
                    value={formData.gradeApplying}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field"
                    rows={4}
                    placeholder="Any additional information..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admissions;