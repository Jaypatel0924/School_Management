// import React, { useState, useEffect } from 'react';
// import { Users, UserPlus, BookOpen, DollarSign, Settings, Bell, Plus, Search, Trash2 } from 'lucide-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [students, setStudents] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [showAddStudent, setShowAddStudent] = useState(false);
//   const [showAddTeacher, setShowAddTeacher] = useState(false);
//   const [showUpdateFees, setShowUpdateFees] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Form states
//   const [studentForm, setStudentForm] = useState({
//     name: '',
//     email: '',
//     grade: 'Grade 8',
//     section: 'Section A',
//     parentName: '',
//     parentContact: '',
//     address: '',
//     dateOfBirth: '',
//     gender: 'Male',
//     password: ''
//   });

//   const [teacherForm, setTeacherForm] = useState({
//     name: '',
//     email: '',
//     employeeId: '',
//     subject: '',
//     qualification: '',
//     experience: '',
//     contactNumber: '',
//     address: '',
//     password: ''
//   });

//   const [feeForm, setFeeForm] = useState({
//     student:'',
//     grade: 'Grade 8',
//     feeType: 'Tuition',
//     amount: '',
//     dueDate: '',
//     academicYear: new Date().getFullYear().toString(),
//     term: 'Term 1'
//   });

//   useEffect(() => {
//     fetchStudents();
//     fetchTeachers();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/students');
//       setStudents(response.data.data.students);
//     } catch (error) {
//       toast.error('Failed to fetch students');
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/teachers');
//       setTeachers(response.data.data.teachers);
//     } catch (error) {
//       toast.error('Failed to fetch teachers');
//     }
//   };

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post('http://localhost:5000/api/students', studentForm);
//       toast.success('Student added successfully');
//       setShowAddStudent(false);
//       fetchStudents();
//       setStudentForm({
//         name: '',
//         email: '',
//         grade: 'Grade 8',
//         section: 'Section A',
//         parentName: '',
//         parentContact: '',
//         address: '',
//         dateOfBirth: '',
//         gender: 'Male',
//         password: ''
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to add student');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddTeacher = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post('http://localhost:5000/api/teachers', teacherForm);
//       toast.success('Teacher added successfully');
//       setShowAddTeacher(false);
//       fetchTeachers();
//       setTeacherForm({
//         name: '',
//         email: '',
//         employeeId: '',
//         subject: '',
//         qualification: '',
//         experience: '',
//         contactNumber: '',
//         address: '',
//         password: ''
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to add teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateFees = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post(`http://localhost:5000/api/fees`, feeForm);
//       toast.success('Fees updated successfully');
//       setShowUpdateFees(false);
//       setFeeForm({
//         grade: 'Grade 8',
//         feeType: 'Tuition',
//         amount: '',
//         dueDate: '',
//         academicYear: new Date().getFullYear().toString(),
//         term: 'Term 1'
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to update fees');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteStudent = async (id) => {
//     if (window.confirm('Are you sure you want to delete this student?')) {
//       try {
//         await axios.delete(`http://localhost:5000/api/students/${id}`);
//         toast.success('Student deleted successfully');
//         fetchStudents();
//       } catch (error) {
//         toast.error('Failed to delete student');
//       }
//     }
//   };

//   const handleDeleteTeacher = async (id) => {
//     if (window.confirm('Are you sure you want to delete this teacher?')) {
//       try {
//         await axios.delete(`http://localhost:5000/api/teachers/${id}`);
//         toast.success('Teacher deleted successfully');
//         fetchTeachers();
//       } catch (error) {
//         toast.error('Failed to delete teacher');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <button className="p-2 text-gray-500 hover:text-gray-700">
//               <Bell className="h-6 w-6" />
//             </button>
//             <button className="p-2 text-gray-500 hover:text-gray-700">
//               <Settings className="h-6 w-6" />
//             </button>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <Users className="h-8 w-8 text-indigo-600" />
//               <span className="text-sm font-medium text-green-600">Active</span>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">{students.length}</h3>
//             <p className="text-gray-600">Total Students</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <BookOpen className="h-8 w-8 text-indigo-600" />
//               <span className="text-sm font-medium text-green-600">Active</span>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">{teachers.length}</h3>
//             <p className="text-gray-600">Total Teachers</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <DollarSign className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">$45,678</h3>
//             <p className="text-gray-600">Fee Collection</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <UserPlus className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">15</h3>
//             <p className="text-gray-600">New Admissions</p>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-4 mb-8">
//           <button
//             onClick={() => setShowAddStudent(true)}
//             className="btn-primary flex items-center"
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add Student
//           </button>
//           <button
//             onClick={() => setShowAddTeacher(true)}
//             className="btn-primary flex items-center"
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add Teacher
//           </button>
//           <button
//             onClick={() => setShowUpdateFees(true)}
//             className="btn-primary flex items-center"
//           >
//             <DollarSign className="h-5 w-5 mr-2" />
//             Update Fees
//           </button>
//         </div>

//         {/* Students Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Students</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {students.map((student) => (
//                     <tr key={student._id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {student.studentId}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {student.grade}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <button
//                           onClick={() => handleDeleteStudent(student._id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Teachers Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">Teachers</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {teachers.map((teacher) => (
//                     <tr key={teacher._id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {teacher.employeeId}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {teacher.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {teacher.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {teacher.subject}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <button
//                           onClick={() => handleDeleteTeacher(teacher._id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Add Student Modal */}
//         {showAddStudent && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//               <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
//               <form onSubmit={handleAddStudent} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     value={studentForm.name}
//                     onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     value={studentForm.email}
//                     onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Grade</label>
//                     <select
//                       value={studentForm.grade}
//                       onChange={(e) => setStudentForm({...studentForm, grade: e.target.value})}
//                       className="input-field"
//                     >
//                       <option>Grade 8</option>
//                       <option>Grade 9</option>
//                       <option>Grade 10</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Section</label>
//                     <select
//                       value={studentForm.section}
//                       onChange={(e) => setStudentForm({...studentForm, section: e.target.value})}
//                       className="input-field"
//                     >
//                       <option>Section A</option>
//                       <option>Section B</option>
//                       <option>Section C</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Parent Name</label>
//                   <input
//                     type="text"
//                     value={studentForm.parentName}
//                     onChange={(e) => setStudentForm({...studentForm, parentName: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Parent Contact</label>
//                   <input
//                     type="text"
//                     value={studentForm.parentContact}
//                     onChange={(e) => setStudentForm({...studentForm, parentContact: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     value={studentForm.address}
//                     onChange={(e) => setStudentForm({...studentForm, address: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//                   <input
//                     type="date"
//                     value={studentForm.dateOfBirth}
//                     onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Gender</label>
//                   <select
//                     value={studentForm.gender}
//                     onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}
//                     className="input-field"
//                   >
//                     <option>Male</option>
//                     <option>Female</option>
//                     <option>Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Password</label>
//                   <input
//                     type="password"
//                     value={studentForm.password}
//                     onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddStudent(false)}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="btn-primary"
//                   >
//                     {loading ? 'Adding...' : 'Add Student'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Add Teacher Modal */}
//         {showAddTeacher && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//               <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
//               <form onSubmit={handleAddTeacher} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Name</label>
//                   <input
//                     type="text"
//                     value={teacherForm.name}
//                     onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     value={teacherForm.email}
//                     onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Employee ID</label>
//                   <input
//                     type="text"
//                     value={teacherForm.employeeId}
//                     onChange={(e) => setTeacherForm({...teacherForm, employeeId: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Subject</label>
//                   <input
//                     type="text"
//                     value={teacherForm.subject}
//                     onChange={(e) => setTeacherForm({...teacherForm, subject: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Qualification</label>
//                   <input
//                     type="text"
//                     value={teacherForm.qualification}
//                     onChange={(e) => setTeacherForm({...teacherForm, qualification: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
//                   <input
//                     type="number"
//                     value={teacherForm.experience}
//                     onChange={(e) => setTeacherForm({...teacherForm, experience: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Contact Number</label>
//                   <input
//                     type="text"
//                     value={teacherForm.contactNumber}
//                     onChange={(e) => setTeacherForm({...teacherForm, contactNumber: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     value={teacherForm.address}
//                     onChange={(e) => setTeacherForm({...teacherForm, address: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Password</label>
//                   <input
//                     type="password"
//                     value={teacherForm.password}
//                     onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddTeacher(false)}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="btn-primary"
//                   >
//                     {loading ? 'Adding...' : 'Add Teacher'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Update Fees Modal */}
//         {showUpdateFees && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//               <h2 className="text-xl font-semibold mb-4">Update Fees</h2>
//               <form onSubmit={handleUpdateFees} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Grade</label>
//                   <select
//                     value={feeForm.grade}
//                     onChange={(e) => setFeeForm({...feeForm, grade: e.target.value})}
//                     className="input-field"
//                   >
//                     <option>Grade 8</option>
//                     <option>Grade 9</option>
//                     <option>Grade 10</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Fee Type</label>
//                   <select
//                     value={feeForm.feeType}
//                     onChange={(e) => setFeeForm({...feeForm, feeType: e.target.value})}
//                     className="input-field"
//                   >
//                     <option>Tuition</option>
//                     <option>Lab</option>
//                     <option>Activity</option>
//                     <option>Transport</option>
//                     <option>Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Amount</label>
//                   <input
//                     type="number"
//                     value={feeForm.amount}
//                     onChange={(e) => setFeeForm({...feeForm, amount: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Due Date</label>
//                   <input
//                     type="date"
//                     value={feeForm.dueDate}
//                     onChange={(e) => setFeeForm({...feeForm, dueDate: e.target.value})}
//                     className="input-field"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Term</label>
//                   <select
//                     value={feeForm.term}
//                     onChange={(e) => setFeeForm({...feeForm, term: e.target.value})}
//                     className="input-field"
//                   >
//                     <option>Term 1</option>
//                     <option>Term 2</option>
//                     <option>Term 3</option>
//                   </select>
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowUpdateFees(false)}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="btn-primary"
//                   >
//                     {loading ? 'Updating...' : 'Update Fees'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect } from 'react';
import { Users, UserPlus, BookOpen, DollarSign, Settings, Bell, Plus, Search, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showUpdateFees, setShowUpdateFees] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    grade: 'Grade 8',
    section: 'Section A',
    parentName: '',
    parentContact: '',
    address: '',
    dateOfBirth: '',
    gender: 'Male',
    password: ''
  });

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    subject: '',
    qualification: '',
    experience: '',
    contactNumber: '',
    address: '',
    password: ''
  });

  const [feeForm, setFeeForm] = useState({
    student: '', // Add student field
    grade: 'Grade 8',
    feeType: 'Tuition',
    amount: '',
    dueDate: '',
    academicYear: new Date().getFullYear().toString(),
    term: 'Term 1'
  });

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data.data.students);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(response.data.data.teachers);
    } catch (error) {
      toast.error('Failed to fetch teachers');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/students', studentForm);
      toast.success('Student added successfully');
      setShowAddStudent(false);
      fetchStudents();
      setStudentForm({
        name: '',
        email: '',
        grade: 'Grade 8',
        section: 'Section A',
        parentName: '',
        parentContact: '',
        address: '',
        dateOfBirth: '',
        gender: 'Male',
        password: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/teachers', teacherForm);
      toast.success('Teacher added successfully');
      setShowAddTeacher(false);
      fetchTeachers();
      setTeacherForm({
        name: '',
        email: '',
        employeeId: '',
        subject: '',
        qualification: '',
        experience: '',
        contactNumber: '',
        address: '',
        password: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFees = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Fee Form:', feeForm); // Debugging: Log the fee form data
      await axios.post(`http://localhost:5000/api/fees`, feeForm);
      toast.success('Fees updated successfully');
      setShowUpdateFees(false);
      setFeeForm({
        student: '', // Reset the form
        grade: 'Grade 8',
        feeType: 'Tuition',
        amount: '',
        dueDate: '',
        academicYear: new Date().getFullYear().toString(),
        term: 'Term 1'
      });
    } catch (error) {
      console.error('Error:', error.response?.data); // Debugging: Log the error response
      toast.error(error.response?.data?.message || 'Failed to update fees');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await axios.delete(`http://localhost:5000/api/teachers/${id}`);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        toast.error('Failed to delete teacher');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{students.length}</h3>
            <p className="text-gray-600">Total Students</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{teachers.length}</h3>
            <p className="text-gray-600">Total Teachers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">$45,678</h3>
            <p className="text-gray-600">Fee Collection</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <UserPlus className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">15</h3>
            <p className="text-gray-600">New Admissions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setShowAddStudent(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Student
          </button>
          <button
            onClick={() => setShowAddTeacher(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Teacher
          </button>
          <button
            onClick={() => setShowUpdateFees(true)}
            className="btn-primary flex items-center"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Update Fees
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Students</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteStudent(student._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Teachers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {teacher.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Student Modal */}
        {showAddStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <select
                      value={studentForm.grade}
                      onChange={(e) => setStudentForm({...studentForm, grade: e.target.value})}
                      className="input-field"
                    >
                      <option>Grade 8</option>
                      <option>Grade 9</option>
                      <option>Grade 10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Section</label>
                    <select
                      value={studentForm.section}
                      onChange={(e) => setStudentForm({...studentForm, section: e.target.value})}
                      className="input-field"
                    >
                      <option>Section A</option>
                      <option>Section B</option>
                      <option>Section C</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                  <input
                    type="text"
                    value={studentForm.parentName}
                    onChange={(e) => setStudentForm({...studentForm, parentName: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Contact</label>
                  <input
                    type="text"
                    value={studentForm.parentContact}
                    onChange={(e) => setStudentForm({...studentForm, parentContact: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={studentForm.address}
                    onChange={(e) => setStudentForm({...studentForm, address: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={studentForm.dateOfBirth}
                    onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})}
                    className="input-field"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Adding...' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Teacher Modal */}
        {showAddTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    value={teacherForm.employeeId}
                    onChange={(e) => setTeacherForm({...teacherForm, employeeId: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm({...teacherForm, subject: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <input
                    type="text"
                    value={teacherForm.qualification}
                    onChange={(e) => setTeacherForm({...teacherForm, qualification: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                  <input
                    type="number"
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({...teacherForm, experience: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    value={teacherForm.contactNumber}
                    onChange={(e) => setTeacherForm({...teacherForm, contactNumber: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={teacherForm.address}
                    onChange={(e) => setTeacherForm({...teacherForm, address: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTeacher(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Adding...' : 'Add Teacher'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Fees Modal */}
        {showUpdateFees && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Update Fees</h2>
              <form onSubmit={handleUpdateFees} className="space-y-4">
                {/* Student Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <select
                    value={feeForm.student}
                    onChange={(e) => setFeeForm({ ...feeForm, student: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} (Grade: {student.grade})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <select
                    value={feeForm.grade}
                    onChange={(e) => setFeeForm({ ...feeForm, grade: e.target.value })}
                    className="input-field"
                  >
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>

                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fee Type</label>
                  <select
                    value={feeForm.feeType}
                    onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value })}
                    className="input-field"
                  >
                    <option>Tuition</option>
                    <option>Lab</option>
                    <option>Activity</option>
                    <option>Transport</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={feeForm.dueDate}
                    onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                {/* Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Term</label>
                  <select
                    value={feeForm.term}
                    onChange={(e) => setFeeForm({ ...feeForm, term: e.target.value })}
                    className="input-field"
                  >
                    <option>Term 1</option>
                    <option>Term 2</option>
                    <option>Term 3</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateFees(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Updating...' : 'Update Fees'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;