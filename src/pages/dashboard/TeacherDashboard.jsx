import React, { useState, useEffect } from "react";

import {
  BookOpen,
  CheckSquare,
  FileText,
  Users,
  Clock,
  Calendar,
  Plus,
  Upload,
  X,
  Trash2,
  Edit,
  Check,
  CheckCircle,
  Download,
  Award,
  Eye,
  Search,
  Filter,
  CalendarDays,
} from "lucide-react";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { format } from "date-fns";

import axios from "axios";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import NotesAndTodos from "../../components/NotesAndTodos";

import AttendancePanel from "../../components/AttendancePanel";

const TeacherDashboard = () => {
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showSubmissionsView, setShowSubmissionsView] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [submissions, setSubmissions] = useState([]);

  const [showGradingModal, setShowGradingModal] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [gradingForm, setGradingForm] = useState({
    marks: "",

    feedback: "",
  });

  const [showUpdateSchedule, setShowUpdateSchedule] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [showUpdateAssignment, setShowUpdateAssignment] = useState(false);

  const [stats, setStats] = useState({
    totalStudents: 0,

    totalAssignments: 0,

    totalMaterials: 0,

    totalClasses: 0,
  });

  const [showAddAssignment, setShowAddAssignment] = useState(false);

  const [activeTab, setActiveTab] = useState("assignments");

  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const [showAttendancePanel, setShowAttendancePanel] = useState(false);

  const [showScheduleClass, setShowScheduleClass] = useState(false);

  const [selectedGrade, setSelectedGrade] = useState("All");

  const [selectedSection, setSelectedSection] = useState("All");

  const [selectedSubject, setSelectedSubject] = useState("All");

  const [attendanceGrade, setAttendanceGrade] = useState("Grade 8");

  const [attendanceSection, setAttendanceSection] = useState("Section A");

  // Attendance report states

  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );

  const [endDate, setEndDate] = useState(new Date());

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const [students, setStudents] = useState([]);

  // Monthly report state
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [monthlyReportLoading, setMonthlyReportLoading] = useState(false);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);

  const [assignments, setAssignments] = useState([]);

  const [materials, setMaterials] = useState([]);

  const [schedule, setSchedule] = useState([]);

  const grades = ["All", "Grade 8", "Grade 9", "Grade 10"];

  const sections = ["All", "Section A", "Section B", "Section C"];

  const subjects = ["All", "Mathematics", "Science", "English", "History"];

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    file: null,
    subject: "",
    grade: "Grade 8",
    section: "Section A",
    dueDate: "",
    maxMarks: "",
  });

  const [materialForm, setMaterialForm] = useState({
    title: "",

    description: "",

    subject: "",

    grade: "Grade 8",

    section: "Section A",

    type: "Notes",

    attachmentUrl: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    subject: "",

    grade: "Grade 8",

    section: "Section A",

    date: "",

    startTime: "",

    endTime: "",

    topic: "",

    description: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:5000/api/students", {
        params: {
          grade: selectedGrade !== "All" ? selectedGrade : undefined,

          section: selectedSection !== "All" ? selectedSection : undefined,

          search: searchTerm || undefined,
        },
      });

      setStudents(response.data.data.students);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async (studentId) => {
    try {
      setAttendanceLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/attendance/student/${studentId}`,
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
    if (!selectedStudent) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendance/download-report/${selectedStudent._id}`,
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
        `attendance_${selectedStudent.name}_${format(
          startDate,
          "yyyy-MM-dd"
        )}_${format(endDate, "yyyy-MM-dd")}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download attendance report");
    }
  };

  useEffect(() => {
    if (activeTab === "attendanceReport") {
      fetchStudents();
    }
  }, [selectedGrade, selectedSection, searchTerm, activeTab]);

  const fetchMonthlyReport = async () => {
    try {
      setMonthlyReportLoading(true);
      const params = {
        grade: selectedGrade === 'All' ? undefined : selectedGrade,
        section: selectedSection === 'All' ? undefined : selectedSection,
        year: reportYear,
        month: reportMonth
      };

      const res = await axios.get('http://localhost:5000/api/attendance/monthly', { params });
      setMonthlyReport(res.data.data.report || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate monthly report');
    } finally {
      setMonthlyReportLoading(false);
    }
  };

  const exportMonthlyReportCSV = () => {
    if (!monthlyReport || monthlyReport.length === 0) return;

    const headers = ['Student ID', 'Student Name', 'Total Days Recorded', 'Present Days', 'Absent Days', 'Attendance %'];
    const rows = monthlyReport.map(r => [r.studentId, r.studentName, r.totalDaysRecorded, r.presentDays, r.absentDays, r.attendancePercentage]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `monthly_attendance_${selectedGrade}_${selectedSection}_${reportYear}_${reportMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (
      selectedStudent &&
      startDate &&
      endDate &&
      activeTab === "attendanceReport"
    ) {
      fetchAttendanceRecords(selectedStudent._id);
    }
  }, [selectedStudent, startDate, endDate, activeTab]);

  const fetchSubmissionsByAssignment = async (assignmentId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/submissions/assignment/${assignmentId}`
      );

      setSubmissions(response.data.data.submissions);
    } catch (error) {
      toast.error("Failed to fetch submissions");

      setSubmissions([]);
    }
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);

    setShowSubmissionsView(true);

    fetchSubmissionsByAssignment(assignment._id);
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.patch(
        `http://localhost:5000/api/submissions/${selectedSubmission._id}/grade`,

        {
          ...gradingForm,

          fileUrl: selectedSubmission.fileUrl,
        }
      );

      toast.success("Submission graded successfully");

      setShowGradingModal(false);

      setSelectedSubmission(null);

      setGradingForm({ marks: "", feedback: "" });

      fetchSubmissionsByAssignment(selectedAssignment._id);
    } catch (error) {
      toast.error("Failed to grade submission");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/api/schedule/${selectedSchedule._id}`,

        scheduleForm
      );

      toast.success("Schedule updated successfully");

      setShowUpdateSchedule(false);

      fetchDashboardData();

      setScheduleForm({
        subject: "",

        grade: "Grade 8",

        section: "Section A",

        date: "",

        startTime: "",

        endTime: "",

        topic: "",

        description: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm("Are you sure you want to delete this Material?")) {
      try {
        await axios.delete(`http://localhost:5000/api/materials/${id}`);

        toast.success("Material deleted successfully");

        fetchDashboardData();
      } catch (error) {
        toast.error(
          "Failed to delete Material or You have not a rights to delete Material"
        );
      }
    }
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/api/assignments/${selectedAssignment._id}`,

        assignmentForm
      );

      toast.success("Assignment updated successfully");

      setShowUpdateAssignment(false);

      fetchDashboardData();

      setAssignmentForm({
        title: "",

        description: "",

        subject: "",

        grade: "Grade 8",

        section: "Section A",

        dueDate: "",

        maxMarks: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update assignment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);

    setScheduleForm({
      subject: schedule.subject,

      grade: schedule.grade,

      section: schedule.section,

      date: schedule.date,

      startTime: schedule.startTime,

      endTime: schedule.endTime,

      topic: schedule.topic,

      description: schedule.description,
    });

    setShowUpdateSchedule(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);

    setAssignmentForm({
      title: assignment.title,

      description: assignment.description,

      subject: assignment.subject,

      grade: assignment.grade,

      section: assignment.section,

      dueDate: assignment.dueDate,

      maxMarks: assignment.maxMarks,
    });

    setShowUpdateAssignment(true);
  };

  const handleDownload = async (submissionId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/submissions/download/${submissionId}`,

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
      toast.error("Failed to download student submission");
    }
  };

  const handleSendAssignmentReminder = async (assignmentId) => {
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/api/assignments/${assignmentId}/send-reminder`);
      toast.success(res.data.message || 'Reminders sent to class');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reminders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [assignmentsRes, materialsRes, scheduleRes, studentRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/assignments/my-assignments"),

          axios.get("http://localhost:5000/api/materials"),

          axios.get("http://localhost:5000/api/schedule"),

          axios.get("http://localhost:5000/api/students"),
        ]);

      setAssignments(assignmentsRes.data.data.assignments);

      setMaterials(materialsRes.data.data.materials);

      setSchedule(scheduleRes.data.data.schedules);

      setStats({
        totalStudents: studentRes.data.data.students.length,

        totalAssignments: assignmentsRes.data.data.assignments.length,

        totalMaterials: materialsRes.data.data.materials.length,

        totalClasses: scheduleRes.data.data.schedules.length,
      });
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // If a file is present, send as multipart/form-data
      if (assignmentForm.file) {
        const formData = new FormData();
        formData.append('title', assignmentForm.title);
        formData.append('subject', assignmentForm.subject);
        formData.append('grade', assignmentForm.grade);
        formData.append('section', assignmentForm.section);
        formData.append('dueDate', assignmentForm.dueDate);
        formData.append('maxMarks', assignmentForm.maxMarks);
        formData.append('file', assignmentForm.file);

        await axios.post('http://localhost:5000/api/assignments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Fallback to JSON if no file
        await axios.post('http://localhost:5000/api/assignments', assignmentForm);
      }

      toast.success('Assignment created successfully');

      setShowAddAssignment(false);

      fetchDashboardData();

      setAssignmentForm({
        title: '',
        file: null,
        subject: '',
        grade: 'Grade 8',
        section: 'Section A',
        dueDate: '',
        maxMarks: '',
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

      await axios.post("http://localhost:5000/api/materials", materialForm);

      toast.success("Material uploaded successfully");

      setShowAddMaterial(false);

      fetchDashboardData();

      setMaterialForm({
        title: "",

        description: "",

        subject: "",

        grade: "Grade 8",

        section: "Section A",

        type: "Notes",

        attachmentUrl: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClass = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/schedule", scheduleForm);

      toast.success("Class scheduled successfully");

      setShowScheduleClass(false);

      fetchDashboardData();

      setScheduleForm({
        subject: "",

        grade: "Grade 8",

        section: "Section A",

        date: "",

        startTime: "",

        endTime: "",

        topic: "",

        description: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm("Are you sure you want to delete this Assignment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/assignments/${id}`);

        toast.success("Assignment deleted successfully");

        fetchDashboardData();

        if (selectedAssignment?._id === id) {
          setSelectedAssignment(null);

          setSubmissions([]);
        }
      } catch (error) {
        toast.error(
          "Failed to delete assignment or You have not a rights to delete assignment"
        );
      }
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm("Are you sure you want to delete this Schedule?")) {
      try {
        await axios.delete(`http://localhost:5000/api/schedule/${id}`);

        toast.success("Schedule deleted successfully");

        fetchDashboardData();
      } catch (error) {
        toast.error(
          "Failed to delete Schedule or You have not a rights to delete Schedule"
        );
      }
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesGrade =
      selectedGrade === "All" || assignment.grade === selectedGrade;

    const matchesSection =
      selectedSection === "All" || assignment.section === selectedSection;

    const matchesSubject =
      selectedSubject === "All" || assignment.subject === selectedSubject;

    return matchesGrade && matchesSection && matchesSubject;
  });

  const getSubmissionStats = (assignment) => {
    if (!assignment) return { submitted: 0, pending: 0, graded: 0 };

    const assignmentSubmissions = submissions.filter(
      (sub) => sub.assignment === assignment._id
    );

    const submitted = assignmentSubmissions.length;

    const graded = assignmentSubmissions.filter(
      (sub) => sub.status === "Graded"
    ).length;

    // Count students belonging to the same grade and section as the assignment
    const studentsInClass = students.filter(
      (s) => s.grade === assignment.grade && s.section === assignment.section
    ).length;

    const pending = Math.max(0, studentsInClass - submitted);

    return { submitted, pending, graded };
  };

  // Mobile tabs options

  const mobileTabsOptions = [
    { value: "assignments", label: "Assignments" },

    { value: "materials", label: "Materials" },

    { value: "attendance", label: "Attendance" },

    { value: "attendanceReport", label: "Attendance Report" },

    { value: "classes", label: "Classes" },

    { value: "notes", label: "Notes & Todos" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Teacher Dashboard
            </h1>

            <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
          </div>
        </div>

        {/* Mobile tabs */}

        <div className="md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {mobileTabsOptions.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop tabs */}

        <div className="hidden md:block bg-white rounded-lg shadow mb-8">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("assignments")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "assignments"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Assignments
              </button>

              <button
                onClick={() => setActiveTab("materials")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "materials"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Materials
              </button>

              <button
                onClick={() => setActiveTab("attendance")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "attendance"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Attendance
              </button>

              <button
                onClick={() => setActiveTab("attendanceReport")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "attendanceReport"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Attendance Report
              </button>

              <button
                onClick={() => setActiveTab("classes")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "classes"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Classes
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "notes"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Notes & Todos
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeTab === "assignments" && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm md:text-base"
                  >
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm md:text-base"
                  >
                    {sections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm md:text-base"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowAddAssignment(true)}
                  className="btn-primary flex items-center w-full md:w-auto justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Assignment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredAssignments.map((assignment) => {
                  const stats = getSubmissionStats(assignment);

                  return (
                    <div
                      key={assignment._id}
                      className="bg-white rounded-lg border shadow-sm p-4 md:p-6"
                    >
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">
                            {assignment.title}
                          </h3>

                          <p className="text-xs md:text-sm text-gray-500">
                            {assignment.subject}
                          </p>
                        </div>

                        <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          Due:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                        {assignment.description}
                      </p>

                      <div className="flex flex-wrap justify-between items-center text-xs md:text-sm text-gray-500 mb-3 md:mb-4 gap-2">
                        <span>{assignment.grade}</span>

                        <span>{assignment.section}</span>

                        <span>Max Marks: {assignment.maxMarks}</span>
                      </div>

                      <div className="flex justify-between items-center mb-3 md:mb-4">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />

                          <span className="text-xs md:text-sm">
                            {stats.submitted} Submitted
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 md:space-x-2">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />

                          <span className="text-xs md:text-sm">
                            {stats.pending} Pending
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleViewSubmissions(assignment)}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs md:text-sm"
                        >
                          <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          View Submissions
                        </button>

                        <div className="flex space-x-1 md:space-x-2">
                          <button
                            onClick={() => handleEditAssignment(assignment)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Edit className="h-3 w-3 md:h-4 md:w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteAssignment(assignment._id)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "materials" && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold">Study Materials</h2>

                <button
                  onClick={() => setShowAddMaterial(true)}
                  className="btn-primary flex items-center w-full md:w-auto justify-center"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Material
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {materials.map((material) => (
                  <div
                    key={material._id}
                    className="bg-white rounded-lg border shadow-sm p-4 md:p-6"
                  >
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">
                        {material.title}
                      </h3>

                      <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {material.type}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                      {material.description}
                    </p>

                    <div className="flex flex-wrap justify-between items-center text-xs md:text-sm text-gray-500 mb-3 md:mb-4 gap-2">
                      <span>{material.subject}</span>

                      <span>{material.grade}</span>

                      <span>{material.section}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <a
                        href={material.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs md:text-sm"
                      >
                        <Download className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Download
                      </a>

                      <div className="flex space-x-1 md:space-x-2">
                        <button
                          onClick={() => handleDeleteMaterial(material._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold">Attendance Management</h2>
              </div>

              <AttendancePanel
                grade={attendanceGrade}
                section={attendanceSection}
              />
            </div>
          )}

          {activeTab === "attendanceReport" && (
            <div className="p-6">
              {/* Filters */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade
                      </label>

                      <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="input-field"
                      >
                        <option value="All">All Grades</option>

                        <option value="Grade 8">Grade 8</option>

                        <option value="Grade 9">Grade 9</option>

                        <option value="Grade 10">Grade 10</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section
                      </label>

                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="input-field"
                      >
                        <option value="All">All Sections</option>

                        <option value="Section A">Section A</option>

                        <option value="Section B">Section B</option>

                        <option value="Section C">Section C</option>
                      </select>
                    </div>
                  </div>

                  {/* <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div> */}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>

                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        maxDate={endDate}
                        className="input-field"
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
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Monthly report controls */}
                  <div className="mt-4 flex items-end gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="number"
                        value={reportYear}
                        onChange={(e) => setReportYear(parseInt(e.target.value || new Date().getFullYear(), 10))}
                        className="input-field"
                        min={2000}
                        max={2100}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                      <select value={reportMonth} onChange={(e) => setReportMonth(parseInt(e.target.value, 10))} className="input-field">
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <button
                        onClick={() => fetchMonthlyReport()}
                        className="btn-primary"
                        disabled={monthlyReportLoading}
                      >
                        {monthlyReportLoading ? 'Generating...' : 'Generate Monthly Report'}
                      </button>
                    </div>

                    {monthlyReport.length > 0 && (
                      <div>
                        <button onClick={() => exportMonthlyReportCSV()} className="btn-secondary">
                          Export CSV
                        </button>
                      </div>
                    )}
                  </div>

                  {/* {selectedStudent && (
                    <button
                      onClick={downloadAttendanceReport}
                      className="btn-primary w-full flex items-center justify-center"
                      disabled={
                        attendanceLoading || attendanceRecords.length === 0
                      }
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Report
                    </button>
                  )} */}
                </div>
              </div>

              {/* Students List */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-sm font-medium text-gray-700">
                      Students
                    </h3>
                  </div>

                  <div className="h-[600px] overflow-y-auto">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : students.length > 0 ? (
                      <div className="divide-y">
                        {students.map((student) => (
                          <button
                            key={student._id}
                            onClick={() => setSelectedStudent(student)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                              selectedStudent?._id === student._id
                                ? "bg-indigo-50"
                                : ""
                            }`}
                          >
                            <p className="font-medium text-gray-900">
                              {student.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {student.grade} - {student.section}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Users className="h-12 w-12 mb-4" />

                        <p>No students found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attendance Records */}

                <div className="md:col-span-2 border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-sm font-medium text-gray-700">
                      {selectedStudent
                        ? `Attendance Records for ${selectedStudent.name}`
                        : "Select a student to view attendance"}
                    </h3>
                  </div>

                  <div className="h-[600px] overflow-y-auto">
                    {/* If monthly report is available show it here */}
                    {monthlyReport && monthlyReport.length > 0 ? (
                      <div className="p-4">
                        <h4 className="text-sm font-medium mb-3">Monthly Attendance Report</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {monthlyReport.map((r) => (
                                <tr key={r.studentRef}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.studentId}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.studentName}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.totalDaysRecorded}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">{r.presentDays}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">{r.absentDays}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.attendancePercentage}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : !selectedStudent ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <CalendarDays className="h-12 w-12 mb-4" />

                        <p>Select a student to view attendance records</p>
                      </div>
                    ) : attendanceLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : attendanceRecords.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Status
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Marked By
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                          {attendanceRecords.map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
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
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Calendar className="h-12 w-12 mb-4" />

                        <p>
                          No attendance records found for selected date range
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "classes" && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold">Class Schedule</h2>
                <button
                  onClick={() => setShowScheduleClass(true)}
                  className="btn-primary flex items-center w-full md:w-auto justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Class
                </button>
              </div>
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 md:p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Upcoming Classes
                  </h2>
                  <div className="space-y-3 md:space-y-4">
                    {schedule.slice(0, 3).map((class_) => (
                      <div
                        key={class_._id}
                        className="p-3 md:p-4 border rounded-lg"
                      >
                        <h3 className="font-medium text-gray-900">
                          {class_.subject}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">
                          {class_.topic}
                        </p>
                        <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between text-xs md:text-sm gap-2">
                          <span className="text-gray-500">
                            {new Date(class_.date).toLocaleDateString()} at{" "}
                            {class_.startTime}
                          </span>
                          <span className="text-indigo-600">
                            {class_.grade} - {class_.section}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 md:mt-5">
                          <button
                            onClick={() => handleDeleteSchedule(class_._id)}
                            className="btn-primary flex items-center justify-center py-2 px-4 w-full sm:w-auto text-sm"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="whitespace-nowrap">
                              Delete Schedule
                            </span>
                          </button>
                          <button
                            onClick={() => handleEditSchedule(class_)}
                            className="btn-primary flex items-center justify-center py-2 px-4 w-full sm:w-auto text-sm"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            <span className="whitespace-nowrap">
                              Update Schedule
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="p-4 md:p-6">
              <NotesAndTodos />
            </div>
          )}
        </div>
      </div>

      {/* Submissions View Modal */}
      {showSubmissionsView && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold">
                  Submissions - {selectedAssignment.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSendAssignmentReminder(selectedAssignment._id)}
                    className="btn-secondary text-sm px-3 py-1"
                    title="Send reminder to class"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reminder to Class'}
                  </button>
                  <button
                    onClick={() => {
                      setShowSubmissionsView(false);
                      setSelectedAssignment(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-green-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-green-600">
                    {getSubmissionStats(selectedAssignment).submitted}
                  </div>
                  <div className="text-xs md:text-sm text-green-600">
                    Submitted
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-yellow-600">
                    {getSubmissionStats(selectedAssignment).pending}
                  </div>
                  <div className="text-xs md:text-sm text-yellow-600">
                    Pending
                  </div>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-blue-600">
                    {getSubmissionStats(selectedAssignment).graded}
                  </div>
                  <div className="text-xs md:text-sm text-blue-600">Graded</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Submission Date
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Marks
                      </th>
                      <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission._id}>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                          <div className="text-xs md:text-sm font-medium text-gray-900">
                            {submission.student.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {submission.student.studentId}
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                          <div className="text-xs md:text-sm text-gray-900">
                            {new Date(
                              submission.submissionDate
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              submission.status === "Graded"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                          <div className="text-xs md:text-sm text-gray-900">
                            {submission.marks || "-"}/
                            {selectedAssignment.maxMarks}
                          </div>
                        </td>
                        <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 md:space-x-4">
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setGradingForm({
                                  marks: submission.marks || "",
                                  feedback: submission.feedback || "",
                                });
                                setShowGradingModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Grade"
                            >
                              <Award className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                            <button
                              onClick={() => handleDownload(submission._id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Download"
                            >
                              <Download className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Grade Submission
              </h2>
              <button
                onClick={() => {
                  setShowGradingModal(false);
                  setSelectedSubmission(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marks (out of {selectedAssignment.maxMarks})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedAssignment.maxMarks}
                  value={gradingForm.marks}
                  onChange={(e) =>
                    setGradingForm({ ...gradingForm, marks: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Feedback
                </label>
                <textarea
                  value={gradingForm.feedback}
                  onChange={(e) =>
                    setGradingForm({ ...gradingForm, feedback: e.target.value })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGradingModal(false);
                    setSelectedSubmission(null);
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
                  {loading ? "Saving..." : "Save Grade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Create New Assignment
              </h2>
              <button onClick={() => setShowAddAssignment(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddAssignment} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      title: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assignment File (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      file: e.target.files[0],
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={assignmentForm.subject}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      subject: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    value={assignmentForm.grade}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        grade: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    value={assignmentForm.section}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        section: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Section C</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        dueDate: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.maxMarks}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        maxMarks: e.target.value,
                      })
                    }
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
                  {loading ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {showAddMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Upload Study Material
              </h2>
              <button onClick={() => setShowAddMaterial(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, title: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) =>
                    setMaterialForm({
                      ...materialForm,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={materialForm.subject}
                  onChange={(e) =>
                    setMaterialForm({
                      ...materialForm,
                      subject: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    value={materialForm.grade}
                    onChange={(e) =>
                      setMaterialForm({
                        ...materialForm,
                        grade: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    value={materialForm.section}
                    onChange={(e) =>
                      setMaterialForm({
                        ...materialForm,
                        section: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Section C</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={materialForm.type}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, type: e.target.value })
                  }
                  className="input-field"
                >
                  <option>Notes</option>
                  <option>Presentation</option>
                  <option>Worksheet</option>
                  <option>Reference</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Material URL
                </label>
                <input
                  type="url"
                  value={materialForm.attachmentUrl}
                  onChange={(e) =>
                    setMaterialForm({
                      ...materialForm,
                      attachmentUrl: e.target.value,
                    })
                  }
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
                  {loading ? "Uploading..." : "Upload Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Class Modal */}
      {showScheduleClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Schedule New Class
              </h2>
              <button onClick={() => setShowScheduleClass(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleScheduleClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={scheduleForm.subject}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      subject: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    value={scheduleForm.grade}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        grade: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    value={scheduleForm.section}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        section: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Section C</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, date: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.startTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        startTime: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.endTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        endTime: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Topic
                </label>
                <input
                  type="text"
                  value={scheduleForm.topic}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, topic: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={scheduleForm.description}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      description: e.target.value,
                    })
                  }
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
                  {loading ? "Scheduling..." : "Schedule Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Schedule Modal */}
      {showUpdateSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Update Scheduled Class
              </h2>
              <button onClick={() => setShowUpdateSchedule(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={scheduleForm.subject}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      subject: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    value={scheduleForm.grade}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        grade: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    value={scheduleForm.section}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        section: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Section C</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, date: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.startTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        startTime: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={scheduleForm.endTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        endTime: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Topic
                </label>
                <input
                  type="text"
                  value={scheduleForm.topic}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, topic: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={scheduleForm.description}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUpdateSchedule(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Updating..." : "Update Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Assignment Modal */}
      {showUpdateAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Update Assignment
              </h2>
              <button onClick={() => setShowUpdateAssignment(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      title: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={assignmentForm.subject}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      subject: e.target.value,
                    })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    value={assignmentForm.grade}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        grade: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    value={assignmentForm.section}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        section: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                    <option>Section C</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        dueDate: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.maxMarks}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        maxMarks: e.target.value,
                      })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUpdateAssignment(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Updating..." : "Update Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
