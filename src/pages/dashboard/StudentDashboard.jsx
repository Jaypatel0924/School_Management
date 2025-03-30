
import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, FileText, Award, Bell, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    completedAssignments: 0,
    upcomingExams: 0,
    averageGrade: 0
  });

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);

  // Form state
  const [submissionForm, setSubmissionForm] = useState({
    attachmentUrl: '',
    comments: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        assignmentsRes,
        submissionsRes,
        scheduleRes,
        announcementsRes,
        materialsRes,
        attendanceRes
      ] = await Promise.all([
        axios.get('http://localhost:5000/api/assignments'),
        // axios.get('http://localhost:5000/api/submissions/my-submissions'),
        axios.get('http://localhost:5000/api/schedule'),
        // axios.get('http://localhost:5000/api/announcements/my-announcements'),
        axios.get('http://localhost:5000/api/materials/student-materials'), // change student-
        // axios.get('http://localhost:5000/api/attendance/my-attendance')
      ]);

      setAssignments(assignmentsRes.data.data.assignments);
      // setSubmissions(submissionsRes.data.data.submissions);
      setSchedule(scheduleRes.data.data.schedules);
      // setAnnouncements(announcementsRes.data.data.announcements);
      setMaterials(materialsRes.data.data.materials);

      // Calculate stats
      // const completedAssignments = submissionsRes.data.data.submissions.filter(
      //   sub => sub.status === 'Submitted' || sub.status === 'Graded'
      // ).length;

      // setStats({
      //   attendancePercentage: parseFloat(attendanceRes.data.data.statistics.attendancePercentage),
      //   completedAssignments,
      //   upcomingExams: 0, // This should come from exams API
      //   averageGrade: calculateAverageGrade(submissionsRes.data.data.submissions)
      // });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageGrade = (submissions) => {
    const gradedSubmissions = submissions.filter(sub => sub.status === 'Graded' && sub.marks);
    if (gradedSubmissions.length === 0) return 0;
    
    const totalMarks = gradedSubmissions.reduce((sum, sub) => sum + sub.marks, 0);
    return (totalMarks / gradedSubmissions.length).toFixed(1);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/submissions', {
        assignmentId: selectedAssignment._id,
        ...submissionForm
      });
      
      toast.success('Assignment submitted successfully');
      setShowSubmissionModal(false);
      setSelectedAssignment(null);
      setSubmissionForm({ attachmentUrl: '', comments: '' });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit assignment');
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
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 relative">
            <Bell className="h-6 w-6" />
            {announcements.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.averageGrade}%</h3>
            <p className="text-gray-600">Average Grade</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.attendancePercentage}%</h3>
            <p className="text-gray-600">Attendance</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.completedAssignments}</h3>
            <p className="text-gray-600">Completed Assignments</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.upcomingExams}</h3>
            <p className="text-gray-600">Upcoming Exams</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assignments */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Active Assignments</h2>
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const submission = submissions.find(s => s.assignment._id === assignment._id);
                  return (
                    <div key={assignment._id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission?.status === 'Graded'
                            ? 'bg-green-100 text-green-800'
                            : submission?.status === 'Submitted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {submission?.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{assignment.subject}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          {submission?.status === 'Graded' ? (
                            <span className="text-green-600 font-medium">
                              Score: {submission.marks}/{assignment.maxMarks}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setShowSubmissionModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              disabled={submission?.status === 'Submitted'}
                            >
                              {submission?.status !== 'Submitted' && (
                                <>
                                  <Upload className="h-4 w-4 mr-1" />
                                  Submit
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Announcements</h2>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-indigo-600">
                        {announcement.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(announcement.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Study Materials */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6">Study Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <div key={material._id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-600">
                      {material.type}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{material.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{material.subject}</p>
                  <a
                    href={material.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Material
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Assignment Modal */}
        {showSubmissionModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Submit Assignment</h2>
                <button onClick={() => {
                  setShowSubmissionModal(false);
                  setSelectedAssignment(null);
                }}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assignment</label>
                  <p className="text-gray-900 font-medium">{selectedAssignment.title}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submission URL</label>
                  <input
                    type="url"
                    value={submissionForm.attachmentUrl}
                    onChange={(e) => setSubmissionForm({...submissionForm, attachmentUrl: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/submission.pdf"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Comments</label>
                  <textarea
                    value={submissionForm.comments}
                    onChange={(e) => setSubmissionForm({...submissionForm, comments: e.target.value})}
                    className="input-field"
                    rows={3}
                    placeholder="Any additional comments..."
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionModal(false);
                      setSelectedAssignment(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Submitting...' : 'Submit Assignment'}
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

export default StudentDashboard;

// import React, { useState, useEffect } from 'react';
// import { BookOpen, Clock, Calendar, FileText, Award, Bell, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useAuth } from '../../context/AuthContext';

// const StudentDashboard = () => {
//   const { currentUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [showSubmissionModal, setShowSubmissionModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);

//   // Data states
//   const [stats, setStats] = useState({
//     attendancePercentage: 0,
//     completedAssignments: 0,
//     upcomingExams: 0,
//     averageGrade: 0
//   });

//   const [assignments, setAssignments] = useState([]);
//   const [submissions, setSubmissions] = useState([]);
//   const [schedule, setSchedule] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
//   const [materials, setMaterials] = useState([]);

//   // Form state
//   const [submissionForm, setSubmissionForm] = useState({
//     attachmentUrl: '',
//     comments: ''
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const [
//         assignmentsRes,
//         submissionsRes,
//         scheduleRes,
//         announcementsRes,
//         materialsRes,
//         attendanceRes
//       ] = await Promise.all([
//         axios.get('http://localhost:5000/api/assignments'),
//         axios.get('http://localhost:5000/api/submissions/my-submissions'),
//         axios.get('http://localhost:5000/api/schedule'),
//         axios.get('http://localhost:5000/api/announcements/my-announcements'),
//         axios.get('http://localhost:5000/api/materials/student-materials'),
//         // axios.get('http://localhost:5000/api/attendance/my-attendance')
//       ]);

//       setAssignments(assignmentsRes.data.data.assignments);
//       setSubmissions(submissionsRes.data.data.submissions);
//       setSchedule(scheduleRes.data.data.schedules);
//       setAnnouncements(announcementsRes.data.data.announcements);
//       setMaterials(materialsRes.data.data.materials);

//       // Calculate stats
//       const completedAssignments = submissionsRes.data.data.submissions.filter(
//         sub => sub.status === 'Submitted' || sub.status === 'Graded'
//       ).length;

//       setStats({
//         attendancePercentage: parseFloat(attendanceRes.data.data.statistics.attendancePercentage),
//         completedAssignments,
//         upcomingExams: 0, // This should come from exams API
//         averageGrade: calculateAverageGrade(submissionsRes.data.data.submissions)
//       });
//     } catch (error) {
//       toast.error('Failed to fetch dashboard data');
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateAverageGrade = (submissions) => {
//     const gradedSubmissions = submissions.filter(sub => sub.status === 'Graded' && sub.marks);
//     if (gradedSubmissions.length === 0) return 0;
    
//     const totalMarks = gradedSubmissions.reduce((sum, sub) => sum + sub.marks, 0);
//     return (totalMarks / gradedSubmissions.length).toFixed(1);
//   };

//   const handleSubmitAssignment = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await axios.post('http://localhost:5000/api/submissions', {
//         assignmentId: selectedAssignment._id,
//         ...submissionForm
//       });
      
//       toast.success('Assignment submitted successfully');
//       setShowSubmissionModal(false);
//       setSelectedAssignment(null);
//       setSubmissionForm({ attachmentUrl: '', comments: '' });
//       fetchDashboardData();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to submit assignment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
//             <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
//           </div>
//           <button className="p-2 text-gray-500 hover:text-gray-700 relative">
//             <Bell className="h-6 w-6" />
//             {announcements.length > 0 && (
//               <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
//             )}
//           </button>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <Award className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">{stats.averageGrade}%</h3>
//             <p className="text-gray-600">Average Grade</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <Clock className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">{stats.attendancePercentage}%</h3>
//             <p className="text-gray-600">Attendance</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <FileText className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">{stats.completedAssignments}</h3>
//             <p className="text-gray-600">Completed Assignments</p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-4">
//               <Calendar className="h-8 w-8 text-indigo-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900">{stats.upcomingExams}</h3>
//             <p className="text-gray-600">Upcoming Exams</p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Assignments */}
//           <div className="lg:col-span-2 bg-white rounded-lg shadow">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold mb-6">Active Assignments</h2>
//               <div className="space-y-4">
//                 {assignments.map((assignment) => {
//                   const submission = submissions.find(s => s.assignment._id === assignment._id);
//                   return (
//                     <div key={assignment._id} className="p-4 border rounded-lg">
//                       <div className="flex items-center justify-between mb-2">
//                         <h3 className="font-medium text-gray-900">{assignment.title}</h3>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           submission?.status === 'Graded'
//                             ? 'bg-green-100 text-green-800'
//                             : submission?.status === 'Submitted'
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {submission?.status || 'Pending'}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-500 mb-2">{assignment.subject}</p>
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-gray-500">
//                           Due: {new Date(assignment.dueDate).toLocaleDateString()}
//                         </span>
//                         <div className="flex items-center space-x-2">
//                           {submission?.status === 'Graded' ? (
//                             <span className="text-green-600 font-medium">
//                               Score: {submission.marks}/{assignment.maxMarks}
//                             </span>
//                           ) : (
//                             <button
//                               onClick={() => {
//                                 setSelectedAssignment(assignment);
//                                 setShowSubmissionModal(true);
//                               }}
//                               className="text-indigo-600 hover:text-indigo-900 flex items-center"
//                               disabled={submission?.status === 'Submitted'}
//                             >
//                               {submission?.status !== 'Submitted' && (
//                                 <>
//                                   <Upload className="h-4 w-4 mr-1" />
//                                   Submit
//                                 </>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Announcements */}
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold mb-6">Announcements</h2>
//               <div className="space-y-4">
//                 {announcements.map((announcement) => (
//                   <div key={announcement._id} className="p-4 border rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-sm font-medium text-indigo-600">
//                         {announcement.type}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         {new Date(announcement.startDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <h3 className="font-medium text-gray-900">{announcement.title}</h3>
//                     <p className="text-sm text-gray-500 mt-1">{announcement.content}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Study Materials */}
//         <div className="mt-8 bg-white rounded-lg shadow">
//           <div className="p-6">
//             <h2 className="text-lg font-semibold mb-6">Study Materials</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {materials.map((material) => (
//                 <div key={material._id} className="p-4 border rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-indigo-600">
//                       {material.type}
//                     </span>
//                   </div>
//                   <h3 className="font-medium text-gray-900">{material.title}</h3>
//                   <p className="text-sm text-gray-500 mb-4">{material.subject}</p>
//                   <a
//                     href={material.attachmentUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
//                   >
//                     <Download className="h-4 w-4 mr-1" />
//                     Download Material
//                   </a>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Submit Assignment Modal */}
//         {showSubmissionModal && selectedAssignment && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg max-w-md w-full p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Submit Assignment</h2>
//                 <button onClick={() => {
//                   setShowSubmissionModal(false);
//                   setSelectedAssignment(null);
//                 }}>
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//               <form onSubmit={handleSubmitAssignment} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Assignment</label>
//                   <p className="text-gray-900 font-medium">{selectedAssignment.title}</p>
//                   <p className="text-sm text-gray-500">Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Submission URL</label>
//                   <input
//                     type="url"
//                     value={submissionForm.attachmentUrl}
//                     onChange={(e) => setSubmissionForm({...submissionForm, attachmentUrl: e.target.value})}
//                     className="input-field"
//                     placeholder="https://example.com/submission.pdf"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Comments</label>
//                   <textarea
//                     value={submissionForm.comments}
//                     onChange={(e) => setSubmissionForm({...submissionForm, comments: e.target.value})}
//                     className="input-field"
//                     rows={3}
//                     placeholder="Any additional comments..."
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-4 mt-6">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowSubmissionModal(false);
//                       setSelectedAssignment(null);
//                     }}
//                     className="btn-secondary"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="btn-primary"
//                   >
//                     {loading ? 'Submitting...' : 'Submit Assignment'}
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

// export default StudentDashboard;