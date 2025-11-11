import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Calendar,
  FileText,
  Award,
  Bell,
  Download,
  Upload,
  Book,
  XCircle,
  CheckCircle,
  StickyNote,
} from "lucide-react";
import NotesAndTodos from "../../components/NotesAndTodos";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("assignments");
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const [stats, setStats] = useState({
    attendancePercentage: 0,
    completedAssignments: 0,
    upcomingExams: 0,
    averageGrade: 0,
  });

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const API_BASE_URL = "http://localhost:5000/api";

  const fetchAttendanceRecords = async () => {
    try {
      setAttendanceLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/attendance/my-attendance`,
        {
          params: {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
          },
        }
      );
      setAttendanceRecords(response.data.data.attendanceRecords);
    } catch (error) {
      toast.error("Failed to fetch attendance records");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const downloadAttendanceReport = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/attendance/download-report`,
        {
          params: {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `attendance_${format(startDate, "yyyy-MM-dd")}_${format(
          endDate,
          "yyyy-MM-dd"
        )}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download attendance report");
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/notifications/my-notifications`
      );
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // const markNotificationAsRead = async (notificationId) => {
  //   try {
  //     await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/read`);
  //     setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== notificationId)
  //   } catch (error) {
  //     console.error("Failed to mark notification as read:", error);
  //   }
  // };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [assignmentsRes, submissionsRes, attendanceRes, scheduleRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/assignments`),
          axios.get(`${API_BASE_URL}/submissions/my-submissions`),
          axios.get(`${API_BASE_URL}/attendance/my-attendance`),
          axios.get(`${API_BASE_URL}/schedule/student-schedule`),
        ]);

      setAssignments(assignmentsRes.data.data.assignments);
      setSubmissions(submissionsRes.data.data.submissions);
      setSchedule(scheduleRes.data.data.schedules);

      // Calculate stats
      const attendanceStats = attendanceRes.data.data.statistics;
      const gradedSubmissions = submissionsRes.data.data.submissions.filter(
        (sub) => sub.status === "Graded"
      );
      const totalGrade = gradedSubmissions.reduce(
        (sum, sub) => sum + (sub.marks / sub.assignment.maxMarks) * 100,
        0
      );
      const averageGrade =
        gradedSubmissions.length > 0
          ? totalGrade / gradedSubmissions.length
          : 0;

      setStats({
        attendancePercentage: parseFloat(attendanceStats.attendancePercentage),
        completedAssignments: gradedSubmissions.length,
        upcomingExams: 0,
        averageGrade: Math.round(averageGrade),
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submissionFile) {
      toast.error("Please select a file to submit");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("assignmentId", selectedAssignment._id);
      formData.append("file", submissionFile);

      await axios.post(`${API_BASE_URL}/submissions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success("Assignment submitted successfully");
      setShowSubmissionModal(false);
      setSelectedAssignment(null);
      setSubmissionFile(null);
      setUploadProgress(0);
      fetchDashboardData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit assignment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (submissionId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/submissions/download/${submissionId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "submission.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download submission");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchAttendanceRecords();
    }
  }, [startDate, endDate]);

  const renderAssignmentsTab = () => (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const submission = submissions.find(
          (s) => s.assignment._id === assignment._id
        );
        return (
          <div
            key={assignment._id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{assignment.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  submission?.status === "Graded"
                    ? "bg-green-100 text-green-800"
                    : submission?.status === "Submitted"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {submission?.status || "Pending"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{assignment.subject}</p>
            {assignment.attachmentUrl && (
              <div className="mb-2">
                <a
                  href={assignment.attachmentUrl}
                  download
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Assignment
                </a>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                {submission?.status === "Graded" ? (
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
                    disabled={submission?.status === "Submitted"}
                  >
                    {submission?.status !== "Submitted" && (
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
  );

  const renderSubmissionsTab = () => (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div
          key={submission._id}
          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">
              {submission.assignment.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                submission.status === "Graded"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {submission.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Submitted:{" "}
            {new Date(submission.submissionDate).toLocaleDateString()}
          </p>
          {submission.status === "Graded" && (
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium text-gray-900">
                Score: {submission.marks}/{submission.assignment.maxMarks}
              </p>
              {submission.feedback && (
                <p className="text-sm text-gray-600 mt-1">
                  Feedback: {submission.feedback}
                </p>
              )}
            </div>
          )}
          <div className="mt-4">
            <button
              onClick={() => handleDownload(submission._id)}
              className="text-indigo-600 hover:text-indigo-900 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Download Submission
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClassesTab = () => (
    <div className="space-y-4">
      {schedule.map((class_) => (
        <div
          key={class_._id}
          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">{class_.subject}</h3>
            <span className="text-sm text-gray-500">
              {class_.startTime} - {class_.endTime}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{class_.topic}</p>
          <p className="text-sm text-gray-500">
            Date: {new Date(class_.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Teacher: {class_.teacher.name}
          </p>
          {class_.description && (
            <p className="text-sm text-gray-600 mt-2">{class_.description}</p>
          )}
        </div>
      ))}

      {schedule.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No upcoming classes
          </h3>
          <p className="text-gray-500">
            Check back later for scheduled classes
          </p>
        </div>
      )}
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              maxDate={endDate}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate}
              maxDate={new Date()}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        {/* <button
          onClick={downloadAttendanceReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          disabled={attendanceLoading || attendanceRecords.length === 0}
        >
          <Download className="h-5 w-5 mr-2" />
          Download Report
        </button> */}
      </div>

      {attendanceLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : attendanceRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marked By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : record.status === "Late"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.markedBy?.name || "System"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No attendance records found
          </h3>
          <p className="text-gray-500">Try selecting a different date range</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
          </div>
          <div className="relative">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="p-3 bg-gray-50 rounded-lg flex justify-between items-start hover:bg-gray-100"
                      >
                        <p className="text-sm text-gray-700 flex-1">
                          {notification.message}
                        </p>
                        <button
                          onClick={() =>
                            markNotificationAsRead(notification._id)
                          }
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {[
            {
              icon: <Award className="h-8 w-8 text-indigo-600" />,
              value: `${stats.averageGrade}%`,
              label: "Average Grade",
            },
            {
              icon: <Clock className="h-8 w-8 text-indigo-600" />,
              value: `${stats.attendancePercentage}%`,
              label: "Attendance",
            },
            {
              icon: <FileText className="h-8 w-8 text-indigo-600" />,
              value: stats.completedAssignments,
              label: "Completed Assignments",
            },
            {
              icon: <Book className="h-8 w-8 text-indigo-600" />,
              value: schedule.length,
              label: "Upcoming Classes",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                {stat.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 md:mb-8 overflow-x-auto">
          <div className="border-b">
            <nav className="flex -mb-px">
              {[
                { id: "assignments", label: "Assignments" },
                { id: "submissions", label: "Submissions" },
                { id: "classes", label: "Classes" },
                { id: "attendance", label: "Attendance" },
                { id: "notes", label: "Notes & Todo" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 md:px-6 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeTab === "assignments" && renderAssignmentsTab()}
          {activeTab === "submissions" && renderSubmissionsTab()}
          {activeTab === "classes" && renderClassesTab()}
          {activeTab === "attendance" && renderAttendanceTab()}
          {activeTab === "notes" && <NotesAndTodos />}
        </div>

        {/* Submit Assignment Modal */}
        {showSubmissionModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Submit Assignment</h2>
                <button
                  onClick={() => {
                    setShowSubmissionModal(false);
                    setSelectedAssignment(null);
                    setSubmissionFile(null);
                    setUploadProgress(0);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assignment
                  </label>
                  <p className="text-gray-900 font-medium">
                    {selectedAssignment.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due:{" "}
                    {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File (PDF, DOC, ZIP)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSubmissionFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                    accept=".pdf,.doc,.docx,.zip"
                    required
                  />
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionModal(false);
                      setSelectedAssignment(null);
                      setSubmissionFile(null);
                      setUploadProgress(0);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Assignment"}
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
