// import React, { useState } from 'react';
// import { BookOpen, CheckSquare, FileText, Users, Clock, Calendar } from 'lucide-react';

// const TeacherDashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');

//   const classes = [
//     { id: 1, name: 'Grade 10A', subject: 'Mathematics', students: 35, time: '9:00 AM' },
//     { id: 2, name: 'Grade 9B', subject: 'Physics', students: 32, time: '10:30 AM' },
//     { id: 3, name: 'Grade 8C', subject: 'Chemistry', students: 30, time: '1:00 PM' }
//   ];

//   const assignments = [
//     { id: 1, title: 'Quadratic Equations', class: 'Grade 10A', dueDate: 'Mar 15, 2024', submissions: 28 },
//     { id: 2, title: 'Newton\'s Laws', class: 'Grade 9B', dueDate: 'Mar 18, 2024', submissions: 25 },
//     { id: 3, title: 'Periodic Table', class: 'Grade 8C', dueDate: 'Mar 20, 2024', submissions: 20 }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <span className="text-sm text-gray-600">Welcome, Mrs. Johnson</span>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <Users className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">97</h3>
//             <p className="text-gray-600">Total Students</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <BookOpen className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">3</h3>
//             <p className="text-gray-600">Classes</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <CheckSquare className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">8</h3>
//             <p className="text-gray-600">Assignments</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <Clock className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">24</h3>
//             <p className="text-gray-600">Hours/Week</p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Today's Classes */}
//           <div className="lg:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold mb-6">Today's Classes</h2>
//               <div className="space-y-4">
//                 {classes.map((class_) => (
//                   <div key={class_.id} className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <h3 className="font-medium text-gray-900">{class_.name}</h3>
//                       <p className="text-sm text-gray-500">{class_.subject}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium text-gray-900">{class_.time}</p>
//                       <p className="text-sm text-gray-500">{class_.students} students</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Assignments */}
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold mb-6">Active Assignments</h2>
//               <div className="space-y-4">
//                 {assignments.map((assignment) => (
//                   <div key={assignment.id} className="p-4 border rounded-lg">
//                     <h3 className="font-medium text-gray-900">{assignment.title}</h3>
//                     <p className="text-sm text-gray-500">{assignment.class}</p>
//                     <div className="mt-2 flex items-center justify-between text-sm">
//                       <span className="text-gray-500">Due: {assignment.dueDate}</span>
//                       <span className="text-indigo-600">{assignment.submissions} submitted</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
//           <button className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors">
//             <FileText className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
//             <span className="text-sm font-medium block text-center">Assign Grades</span>
//           </button>
//           <button className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors">
//             <BookOpen className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
//             <span className="text-sm font-medium block text-center">Upload Material</span>
//           </button>
//           <button className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors">
//             <CheckSquare className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
//             <span className="text-sm font-medium block text-center">Create Assignment</span>
//           </button>
//           <button className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors">
//             <Calendar className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
//             <span className="text-sm font-medium block text-center">Schedule Class</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckSquare, FileText, Users, Clock, Calendar, Plus, Upload, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    totalMaterials: 0,
    totalClasses: 0
  });

  // Modal states
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showScheduleClass, setShowScheduleClass] = useState(false);

  // Data states
  const [assignments, setAssignments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Form states
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    subject: '',
    grade: 'Grade 8',
    section: 'Section A',
    dueDate: '',
    maxMarks: ''
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    subject: '',
    grade: 'Grade 8',
    section: 'Section A',
    type: 'Notes',
    attachmentUrl: ''
  });

  const [scheduleForm, setScheduleForm] = useState({
    subject: '',
    grade: 'Grade 8',
    section: 'Section A',
    date: '',
    startTime: '',
    endTime: '',
    topic: '',
    description: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, materialsRes, scheduleRes] = await Promise.all([
        axios.get('http://localhost:5000/api/assignments/my-assignments'),
        axios.get('http://localhost:5000/api/materials'),
        axios.get('http://localhost:5000/api/schedule')
      ]);

      setAssignments(assignmentsRes.data.data.assignments);
      setMaterials(materialsRes.data.data.materials);
      setSchedule(scheduleRes.data.data.schedules);

      // Update stats
      setStats({
        totalStudents: 97, // This should come from an API
        totalAssignments: assignmentsRes.data.data.assignments.length,
        totalMaterials: materialsRes.data.data.materials.length,
        totalClasses: scheduleRes.data.data.schedules.length
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/assignments', assignmentForm);
      toast.success('Assignment created successfully');
      setShowAddAssignment(false);
      fetchDashboardData();
      setAssignmentForm({
        title: '',
        description: '',
        subject: '',
        grade: 'Grade 8',
        section: 'Section A',
        dueDate: '',
        maxMarks: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/materials', materialForm);
      toast.success('Material uploaded successfully');
      setShowAddMaterial(false);
      fetchDashboardData();
      setMaterialForm({
        title: '',
        description: '',
        subject: '',
        grade: 'Grade 8',
        section: 'Section A',
        type: 'Notes',
        attachmentUrl: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClass = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/schedule', scheduleForm);
      toast.success('Class scheduled successfully');
      setShowScheduleClass(false);
      fetchDashboardData();
      setScheduleForm({
        subject: '',
        grade: 'Grade 8',
        section: 'Section A',
        date: '',
        startTime: '',
        endTime: '',
        topic: '',
        description: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents}</h3>
            <p className="text-gray-600">Total Students</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckSquare className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</h3>
            <p className="text-gray-600">Assignments</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</h3>
            <p className="text-gray-600">Materials</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalClasses}</h3>
            <p className="text-gray-600">Classes</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowAddAssignment(true)}
            className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors"
          >
            <Plus className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
            <span className="text-sm font-medium block text-center">Create Assignment</span>
          </button>
          <button
            onClick={() => setShowAddMaterial(true)}
            className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors"
          >
            <Upload className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
            <span className="text-sm font-medium block text-center">Upload Material</span>
          </button>
          <button
            onClick={() => setShowScheduleClass(true)}
            className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors"
          >
            <Calendar className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
            <span className="text-sm font-medium block text-center">Schedule Class</span>
          </button>
          <button className="p-4 bg-white rounded-lg shadow hover:bg-indigo-50 transition-colors">
            <FileText className="h-6 w-6 text-indigo-600 mb-2 mx-auto" />
            <span className="text-sm font-medium block text-center">View Reports</span>
          </button>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Assignments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Assignments</h2>
              <div className="space-y-4">
                {assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment._id} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">{assignment.subject}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span className="text-indigo-600">{assignment.submissions?.length || 0} submissions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
              <div className="space-y-4">
                {schedule.slice(0, 3).map((class_) => (
                  <div key={class_._id} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900">{class_.subject}</h3>
                    <p className="text-sm text-gray-500">{class_.topic}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {new Date(class_.date).toLocaleDateString()} at {class_.startTime}
                      </span>
                      <span className="text-indigo-600">{class_.grade} - {class_.section}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Assignment Modal */}
        {showAddAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Create New Assignment</h2>
                <button onClick={() => setShowAddAssignment(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={assignmentForm.subject}
                    onChange={(e) => setAssignmentForm({...assignmentForm, subject: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <select
                      value={assignmentForm.grade}
                      onChange={(e) => setAssignmentForm({...assignmentForm, grade: e.target.value})}
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
                      value={assignmentForm.section}
                      onChange={(e) => setAssignmentForm({...assignmentForm, section: e.target.value})}
                      className="input-field"
                    >
                      <option>Section A</option>
                      <option>Section B</option>
                      <option>Section C</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Marks</label>
                    <input
                      type="number"
                      value={assignmentForm.maxMarks}
                      onChange={(e) => setAssignmentForm({...assignmentForm, maxMarks: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddAssignment(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Creating...' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Material Modal */}
        {showAddMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upload Study Material</h2>
                <button onClick={() => setShowAddMaterial(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={materialForm.subject}
                    onChange={(e) => setMaterialForm({...materialForm, subject: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <select
                      value={materialForm.grade}
                      onChange={(e) => setMaterialForm({...materialForm, grade: e.target.value})}
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
                      value={materialForm.section}
                      onChange={(e) => setMaterialForm({...materialForm, section: e.target.value})}
                      className="input-field"
                    >
                      <option>Section A</option>
                      <option>Section B</option>
                      <option>Section C</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={materialForm.type}
                    onChange={(e) => setMaterialForm({...materialForm, type: e.target.value})}
                    className="input-field"
                  >
                    <option>Notes</option>
                    <option>Presentation</option>
                    <option>Worksheet</option>
                    <option>Reference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Material URL</label>
                  <input
                    type="url"
                    value={materialForm.attachmentUrl}
                    onChange={(e) => setMaterialForm({...materialForm, attachmentUrl: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/material.pdf"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddMaterial(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Uploading...' : 'Upload Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Class Modal */}
        {showScheduleClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Schedule New Class</h2>
                <button onClick={() => setShowScheduleClass(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleScheduleClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={scheduleForm.subject}
                    onChange={(e) => setScheduleForm({...scheduleForm, subject: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <select
                      value={scheduleForm.grade}
                      onChange={(e) => setScheduleForm({...scheduleForm, grade: e.target.value})}
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
                      value={scheduleForm.section}
                      onChange={(e) => setScheduleForm({...scheduleForm, section: e.target.value})}
                      className="input-field"
                    >
                      <option>Section A</option>
                      <option>Section B</option>
                      <option>Section C</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="time"
                      value={scheduleForm.startTime}
                      onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="time"
                      value={scheduleForm.endTime}
                      onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Topic</label>
                  <input
                    type="text"
                    value={scheduleForm.topic}
                    onChange={(e) => setScheduleForm({...scheduleForm, topic: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowScheduleClass(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Class'}
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

export default TeacherDashboard;