import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  BookOpen,
  DollarSign,
  Settings,
  Bell,
  Plus,
  Search,
  Trash2,
  Mail,
  GraduationCap,
  Edit,
  CheckCircle,
  X,
  Award,
  IndianRupee,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AddFeeModal from "../../components/AddFeeModal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [results, setResults] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showUpdateFees, setShowUpdateFees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpdateStudent, setShowUpdateStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUpdateTeacher, setShowUpdateTeacher] = useState(false);
  const [selectedTeacher, setSelectedTecaher] = useState(null);
  const [feeRecords, setFeeRecords] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // 'student' or 'teacher'
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [feeStats, setFeeStats] = useState({
    totalFees: 0,
    collectedFees: 0,
    pendingFees: 0,
    collectionPercentage: 0,
  });
  const [feeFilters, setFeeFilters] = useState({
    grade: "All",
    section: "All",
    status: "All",
    search: "",
  });
  const [fees, setFees] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");

  const grades = ["All", "Grade 8", "Grade 9", "Grade 10"];
  const sections = ["All", "Section A", "Section B", "Section C"];

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    grade: "Grade 8",
    section: "Section A",
    parentName: "",
    parentContact: "",
    address: "",
    dateOfBirth: "",
    gender: "Male",
    password: "",
  });

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    subject: "",
    qualification: "",
    experience: "",
    contactNumber: "",
    address: "",
    password: "",
  });

  const [feeForm, setFeeForm] = useState({
    grade: "",
    feeType: "",
    amount: "",
    dueDate: "",
    academicYear: "",
    term: "",
  });

  const handleAddFee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/fees", feeForm);
      toast.success("Fee record created successfully");
      setShowAddFeeModal(false);
      setFeeForm({
        grade: "",
        feeType: "",
        amount: "",
        dueDate: "",
        academicYear: "",
        term: "",
      });
      fetchFees();
      fetchFeeStatistics();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create fee record"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeStatistics = async () => {
    try {
      const params = {};
      if (feeFilters.grade !== "All") params.grade = feeFilters.grade;
      if (feeFilters.section !== "All") params.section = feeFilters.section;

      const response = await axios.get(
        "http://localhost:5000/api/fees/statistics",
        {
          params,
        }
      );
      setFeeStats(response.data.data.statistics);
    } catch (error) {
      toast.error("Failed to fetch fee statistics");
    }
  };

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (feeFilters.grade !== "All") params.grade = feeFilters.grade;
      if (feeFilters.section !== "All") params.section = feeFilters.section;
      if (feeFilters.status !== "All") params.status = feeFilters.status;
      if (feeFilters.search) params.search = feeFilters.search;

      const response = await axios.get("http://localhost:5000/api/fees", {
        params,
      });
      setFees(response.data.data.fees);
    } catch (error) {
      toast.error("Failed to fetch fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "fees") {
      fetchFees();
      fetchFeeStatistics();
    }
  }, [activeTab, feeFilters]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentsRes, teachersRes, admissionsRes, contactsRes, feesRes, resultsRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/students"),
          axios.get("http://localhost:5000/api/teachers"),
          axios.get("http://localhost:5000/api/admissions"),
          axios.get("http://localhost:5000/api/contacts"),
          axios.get("http://localhost:5000/api/fees"),
          axios.get("http://localhost:5000/api/results"),
        ]);

      console.log(studentsRes);
      console.log(teachersRes);
      console.log(admissionsRes);
      console.log(contactsRes);
      console.log(feesRes);

      setStudents(studentsRes.data.data.students);
      setTeachers(teachersRes.data.data.teachers);
      setAdmissions(admissionsRes.data.data.admissions);
      setContacts(contactsRes.data.data.contacts);
      setFeeRecords(feesRes.data.data.fees);
      setResults(resultsRes.data.data.results);

      // Calculate stats
      const totalFees = feesRes.data.data.fees.reduce(
        (sum, fee) => sum + fee.amount,
        0
      );
      const collectedFees = feesRes.data.data.fees
        .filter((fee) => fee.status === "Paid")
        .reduce((sum, fee) => sum + fee.amount, 0);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "All" || student.grade === selectedGrade;
    const matchesSection =
      selectedSection === "All" || student.section === selectedSection;
    return matchesSearch && matchesGrade && matchesSection;
  });

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/students/${selectedStudent._id}`,
        studentForm
      );
      toast.success("Student updated successfully");
      setShowUpdateStudent(false);
      setStudentForm({
        name: "",
        email: "",
        grade: "Grade 8",
        section: "Section A",
        parentName: "",
        parentContact: "",
        address: "",
        dateOfBirth: "",
        gender: "Male",
        password: "",
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/teachers/${selectedTeacher._id}`,
        teacherForm
      );
      toast.success("Teacher updated successfully");
      setShowUpdateTeacher(false);
      setTeacherForm({
        name: "",
        email: "",
        employeeId: "",
        subject: "",
        qualification: "",
        experience: "",
        contactNumber: "",
        address: "",
        password: "",
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update Teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      grade: student.grade,
      section: student.section,
      parentName: student.parentName,
      parentContact: student.parentContact,
      address: student.address,
      dateOfBirth: student.dateOfBirth?.split("T")[0] || "",
      gender: student.gender,
      password: "",
    });
    setShowUpdateStudent(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTecaher(teacher);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      employeeId: teacher.employeeId,
      subject: teacher.subject,
      qualification: teacher.qualification,
      experience: teacher.experience,
      contactNumber: teacher.contactNumber,
      address: teacher.address,
      password: "",
    });
    setShowUpdateTeacher(true);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/students", studentForm);
      toast.success("Student added successfully");
      setShowAddStudent(false);
      setStudentForm({
        name: "",
        email: "",
        grade: "Grade 8",
        section: "Section A",
        parentName: "",
        parentContact: "",
        address: "",
        dateOfBirth: "",
        gender: "Male",
        password: "",
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/teachers", teacherForm);
      toast.success("Teacher added successfully");
      setShowAddTeacher(false);
      setTeacherForm({
        name: "",
        email: "",
        employeeId: "",
        subject: "",
        qualification: "",
        experience: "",
        contactNumber: "",
        address: "",
        password: "",
      });
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = (id) => {
    setItemToDelete(id);
    setDeleteType("student");
    setShowDeleteConfirm(true);
  };

  const handleDeleteTeacher = (id) => {
    setItemToDelete(id);
    setDeleteType("teacher");
    setShowDeleteConfirm(true);
  };

  const handleUpdateAdmissionStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/admissions/${id}`, {
        status,
      });
      toast.success("Admission status updated successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update admission status");
    }
  };

  const handleUpdateContactStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/contacts/${id}`, { status });
      toast.success("Contact status updated successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update contact status");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Reviewing":
        return "bg-blue-100 text-blue-800";
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Responded":
        return "bg-green-100 text-green-800";
      case "Unread":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderResultsTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Results Management</h2>
        <button
          onClick={() => window.location.href = '/results/generate'}
          className="btn-primary"
        >
          Generate Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900">
            {results.length}
          </h3>
          <p className="text-gray-600">Total Results Published</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-green-600">
            {results.filter(result => result.status === 'Published').length}
          </h3>
          <p className="text-gray-600">Published Results</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-yellow-600">
            {results.filter(result => result.status === 'Draft').length}
          </h3>
          <p className="text-gray-600">Draft Results</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="input-field w-40"
          >
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="input-field w-40"
          >
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Obtained</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results
                .filter(result => {
                  const matchesSearch = 
                    (result.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                    (result.student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
                  const matchesGrade = selectedGrade === 'All' || result.grade === selectedGrade;
                  const matchesSection = selectedSection === 'All' || result.section === selectedSection;
                  return matchesSearch && matchesGrade && matchesSection;
                })
                .map((result) => (
                <tr key={result._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {result.student ? result.student.name : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.student ? result.student.rollNumber : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.totalMarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.obtainedMarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.percentage ? result.percentage.toFixed(2) : '0.00'}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => window.location.href = `/results/view/${result._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => window.location.href = `/results/edit/${result._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFeesTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Fee Management</h2>
        <button
          onClick={() => setShowAddFeeModal(true)}
          className="btn-primary"
        >
          Add Fee Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900">
            ₹{feeStats.totalFees}
          </h3>
          <p className="text-gray-600">Total Fees</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-green-600">
            ₹{feeStats.collectedFees}
          </h3>
          <p className="text-gray-600">Collected Fees</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-red-600">
            ₹{feeStats.pendingFees}
          </h3>
          <p className="text-gray-600">Pending Fees</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-indigo-600">
            {feeStats.collectionPercentage.toFixed(2)}%
          </h3>
          <p className="text-gray-600">Collection Rate</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={feeFilters.search}
              onChange={(e) =>
                setFeeFilters({ ...feeFilters, search: e.target.value })
              }
              className="input-field"
            />
          </div>
          <select
            value={feeFilters.grade}
            onChange={(e) =>
              setFeeFilters({ ...feeFilters, grade: e.target.value })
            }
            className="input-field w-40"
          >
            <option value="All">All Grades</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
          </select>
          <select
            value={feeFilters.section}
            onChange={(e) =>
              setFeeFilters({ ...feeFilters, section: e.target.value })
            }
            className="input-field w-40"
          >
            <option value="All">All Sections</option>
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
          </select>
          <select
            value={feeFilters.status}
            onChange={(e) =>
              setFeeFilters({ ...feeFilters, status: e.target.value })
            }
            className="input-field w-40"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.map((fee) => (
                <tr key={`${fee._id}_${fee.student._id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {fee.student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fee.student.rollNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fee.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fee.student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fee.feeType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{fee.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fee.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : fee.status === "Overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      <AddFeeModal
        showAddFeeModal={showAddFeeModal}
        setShowAddFeeModal={setShowAddFeeModal}
        handleAddFee={handleAddFee}
        feeForm={feeForm}
        setFeeForm={setFeeForm}
        loading={loading}
      />
    </div>
  );

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
            <h3 className="text-2xl font-bold text-gray-900">
              {students.length}
            </h3>
            <p className="text-gray-600">Total Students</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {teachers.length}
            </h3>
            <p className="text-gray-600">Total Teachers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {admissions.length}
            </h3>
            <p className="text-gray-600">New Admissions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Mail className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {contacts.length}
            </h3>
            <p className="text-gray-600">Contact Inquiries</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b">
            {/* Desktop view */}
            <nav className="hidden md:flex -mb-px">
              <button
                onClick={() => setActiveTab("students")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "students"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("teachers")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "teachers"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Teachers
              </button>
              <button
                onClick={() => setActiveTab("admissions")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "admissions"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Admissions
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "contacts"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Contacts
              </button>
              <button
                onClick={() => setActiveTab("fees")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "fees"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Fee Collection
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === "results"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Results
              </button>
            </nav>

            {/* Mobile view */}
            <div className="md:hidden flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("students")}
                className={`py-4 px-4 text-xs font-medium whitespace-nowrap ${
                  activeTab === "students"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("teachers")}
                className={`py-4 px-4 text-xs font-medium whitespace-nowrap ${
                  activeTab === "teachers"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Teachers
              </button>
              <button
                onClick={() => setActiveTab("admissions")}
                className={`py-4 px-4 text-xs font-medium whitespace-nowrap ${
                  activeTab === "admissions"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Admissions
              </button>
              <button
                onClick={() => setActiveTab("contacts")}
                className={`py-4 px-4 text-xs font-medium whitespace-nowrap ${
                  activeTab === "contacts"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Contacts
              </button>
              <button
                onClick={() => setActiveTab("fees")}
                className={`py-4 px-4 text-xs font-medium whitespace-nowrap ${
                  activeTab === "fees"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Fee Collection
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeTab === "students" && (
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddStudent(true)}
                  className="btn-primary flex items-center"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Student
                </button>
              </div>

              {/* Grid of grade/section boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grades.filter(grade => grade !== "All").map(grade => (
                  <div key={grade} className="bg-white rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{grade}</h3>
                    <div className="space-y-4">
                      {sections.filter(section => section !== "All").map(section => {
                        const sectionStudents = students.filter(
                          student => 
                            student.grade === grade && 
                            student.section === section &&
                            (searchTerm === "" || 
                             student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
                        );
                        return (
                          <div key={section} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-700">{section}</h4>
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {sectionStudents.length} students
                              </span>
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {sectionStudents.map(student => (
                                <div key={student._id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                    <div className="text-xs text-gray-500">ID: {student.studentId}</div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditStudent(student)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                      title="Edit student"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStudent(student._id)}
                                      className="text-red-600 hover:text-red-900"
                                      title="Delete student"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {sectionStudents.length === 0 && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  No students in this section
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "teachers" && (
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold">Teachers</h2>
                <button
                  onClick={() => setShowAddTeacher(true)}
                  className="btn-primary flex items-center w-full sm:w-auto justify-center"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Teacher
                </button>
              </div>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee ID
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Subject
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher._id}>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.employeeId}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {teacher.name}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {teacher.email}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {teacher.subject}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2 md:mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "admissions" && (
            <div className="p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-6">
                Admission Applications
              </h2>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Grade
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admissions.map((admission) => (
                      <tr key={admission._id}>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {admission.firstName} {admission.lastName}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {admission.email}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {admission.gradeApplying}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                              admission.status
                            )}`}
                          >
                            {admission.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <select
                            className="text-xs sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={admission.status}
                            onChange={(e) =>
                              handleUpdateAdmissionStatus(
                                admission._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-6">Contact Inquiries</h2>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Subject
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {contact.email}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {contact.subject}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                              contact.status
                            )}`}
                          >
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <select
                            className="text-xs sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={contact.status}
                            onChange={(e) =>
                              handleUpdateContactStatus(
                                contact._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="Unread">Unread</option>
                            <option value="Read">Read</option>
                            <option value="Responded">Responded</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "fees" && renderFeesTab()}
          {activeTab === "results" && renderResultsTab()}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {deleteType}? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setShowDeleteConfirm(false);
                    try {
                      if (deleteType === "student") {
                        await axios.delete(
                          `http://localhost:5000/api/students/${itemToDelete}`
                        );
                        toast.success("Student deleted successfully");
                      } else {
                        await axios.delete(
                          `http://localhost:5000/api/teachers/${itemToDelete}`
                        );
                        toast.success("Teacher deleted successfully");
                      }
                      fetchDashboardData();
                    } catch (error) {
                      toast.error(`Failed to delete ${deleteType}`);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddStudent && (
          // Replace the existing modal background div with this:
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-6xl w-full flex flex-col md:flex-row">
              {/* Image Slider Section */}
              <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex flex-col items-center justify-center">
                <div className="relative w-full h-64 md:h-full overflow-hidden rounded-lg">
                  {/* Slide 1 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center transition-opacity duration-500 ">
                    <Users className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Student Management
                    </h3>
                    <p className="text-blue-100">
                      Easily add and manage all your students in one place
                    </p>
                  </div>

                  {/* Slide 2 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <BookOpen className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                    <p className="text-blue-100">
                      Monitor student performance and attendance
                    </p>
                  </div>

                  {/* Slide 3 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <CheckCircle className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Complete Profiles
                    </h3>
                    <p className="text-blue-100">
                      Maintain detailed student records
                    </p>
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex space-x-2 mt-4">
                  {[1, 2, 3].map((dot) => (
                    <button
                      key={dot}
                      className="w-3 h-3 rounded-full bg-white bg-opacity-30 focus:outline-none"
                      aria-label={`Go to slide ${dot}`}
                    />
                  ))}
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-screen">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Add New Student
                  </h2>
                  <button
                    onClick={() => setShowAddStudent(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={studentForm.name}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={studentForm.email}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Grade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade
                      </label>
                      <select
                        value={studentForm.grade}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            grade: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Grade 8</option>
                        <option>Grade 9</option>
                        <option>Grade 10</option>
                      </select>
                    </div>

                    {/* Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section
                      </label>
                      <select
                        value={studentForm.section}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            section: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Section A</option>
                        <option>Section B</option>
                        <option>Section C</option>
                      </select>
                    </div>

                    {/* Parent Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Name
                      </label>
                      <input
                        type="text"
                        value={studentForm.parentName}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            parentName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Parent Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Contact
                      </label>
                      <input
                        type="text"
                        value={studentForm.parentContact}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            parentContact: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={studentForm.address}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={studentForm.dateOfBirth}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={studentForm.gender}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            gender: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={studentForm.password}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddStudent(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add Student"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Teacher Modal */}

        {showAddTeacher && (
          // Replace the existing modal background div with this:
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
            {" "}
            <div className="bg-white rounded-lg max-w-6xl w-full flex flex-col md:flex-row">
              {/* Image Slider Section */}
              <div className="w-full md:w-1/3 bg-gradient-to-br from-purple-500 to-indigo-600 p-6 flex flex-col items-center justify-center">
                <div className="relative w-full h-64 md:h-full overflow-hidden rounded-lg">
                  {/* Slide 1 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center transition-opacity duration-500">
                    <Users className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Teacher Management
                    </h3>
                    <p className="text-purple-100">
                      Efficiently manage your teaching staff
                    </p>
                  </div>

                  {/* Slide 2 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <BookOpen className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Expert Educators</h3>
                    <p className="text-purple-100">
                      Track qualifications and specialties
                    </p>
                  </div>

                  {/* Slide 3 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <Award className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Experience Matters
                    </h3>
                    <p className="text-purple-100">
                      Maintain detailed professional records
                    </p>
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex space-x-2 mt-4">
                  {[1, 2, 3].map((dot) => (
                    <button
                      key={dot}
                      className="w-3 h-3 rounded-full bg-white bg-opacity-30 focus:outline-none"
                      aria-label={`Go to slide ${dot}`}
                    />
                  ))}
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-screen">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Add New Teacher
                  </h2>
                  <button
                    onClick={() => setShowAddTeacher(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleAddTeacher} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={teacherForm.name}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={teacherForm.email}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Employee ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={teacherForm.employeeId}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            employeeId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Subject
                      </label>
                      <input
                        type="text"
                        value={teacherForm.subject}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            subject: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Qualification */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        value={teacherForm.qualification}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            qualification: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        placeholder="Degrees, certifications, etc."
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        value={teacherForm.experience}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            experience: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        min="0"
                        max="50"
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={teacherForm.contactNumber}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={teacherForm.address}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={teacherForm.password}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        placeholder="Set initial password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddTeacher(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add Teacher"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showUpdateStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-6xl w-full flex flex-col md:flex-row">
              {/* Image Slider Section */}
              <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex flex-col items-center justify-center">
                <div className="relative w-full h-64 md:h-full overflow-hidden rounded-lg">
                  {/* Slide 1 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center transition-opacity duration-500">
                    <Users className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Student Profile</h3>
                    <p className="text-blue-100">
                      Update and manage student information
                    </p>
                  </div>

                  {/* Slide 2 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <BookOpen className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Academic Details</h3>
                    <p className="text-blue-100">
                      Maintain accurate grade and section information
                    </p>
                  </div>

                  {/* Slide 3 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <CheckCircle className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Parental Contacts
                    </h3>
                    <p className="text-blue-100">
                      Keep emergency contacts up-to-date
                    </p>
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex space-x-2 mt-4">
                  {[1, 2, 3].map((dot) => (
                    <button
                      key={dot}
                      className="w-3 h-3 rounded-full bg-white bg-opacity-30 focus:outline-none"
                      aria-label={`Go to slide ${dot}`}
                    />
                  ))}
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-screen">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Update Student Profile
                  </h2>
                  <button
                    onClick={() => setShowUpdateStudent(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateStudent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={studentForm.name}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={studentForm.email}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Grade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade
                      </label>
                      <select
                        value={studentForm.grade}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            grade: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Grade 8</option>
                        <option>Grade 9</option>
                        <option>Grade 10</option>
                      </select>
                    </div>

                    {/* Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section
                      </label>
                      <select
                        value={studentForm.section}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            section: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Section A</option>
                        <option>Section B</option>
                        <option>Section C</option>
                      </select>
                    </div>

                    {/* Parent Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        value={studentForm.parentName}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            parentName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Parent Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent/Guardian Contact
                      </label>
                      <input
                        type="tel"
                        value={studentForm.parentContact}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            parentContact: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={studentForm.address}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={studentForm.dateOfBirth}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={studentForm.gender}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            gender: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={studentForm.password}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Leave blank to keep current password"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only enter if you want to change the password
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUpdateStudent(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Update Student"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showUpdateTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-6xl w-full flex flex-col md:flex-row">
              {/* Image Slider Section */}
              <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex flex-col items-center justify-center">
                <div className="relative w-full h-64 md:h-full overflow-hidden rounded-lg">
                  {/* Slide 1 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center transition-opacity duration-500">
                    <Users className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Teacher Profile</h3>
                    <p className="text-blue-100">
                      Update and manage teacher information
                    </p>
                  </div>

                  {/* Slide 2 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <BookOpen className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Professional Details
                    </h3>
                    <p className="text-blue-100">
                      Maintain qualification and experience information
                    </p>
                  </div>

                  {/* Slide 3 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center opacity-0 transition-opacity duration-500">
                    <CheckCircle className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      Contact Information
                    </h3>
                    <p className="text-blue-100">
                      Keep contact details up-to-date
                    </p>
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex space-x-2 mt-4">
                  {[1, 2, 3].map((dot) => (
                    <button
                      key={dot}
                      className="w-3 h-3 rounded-full bg-white bg-opacity-30 focus:outline-none"
                      aria-label={`Go to slide ${dot}`}
                    />
                  ))}
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-screen">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Update Teacher Profile
                  </h2>
                  <button
                    onClick={() => setShowUpdateTeacher(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateTeacher} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={teacherForm.name}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={teacherForm.email}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Employee ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={teacherForm.employeeId}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            employeeId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={teacherForm.contactNumber}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            contactNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Primary Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Subject
                      </label>
                      <input
                        type="text"
                        value={teacherForm.subject}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            subject: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Qualifications */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        value={teacherForm.qualification}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            qualification: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        placeholder="Degrees, certifications, etc."
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        value={teacherForm.experience}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            experience: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        min="0"
                        max="50"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={teacherForm.address}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={teacherForm.password}
                        onChange={(e) =>
                          setTeacherForm({
                            ...teacherForm,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Leave blank to keep current password"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only enter if you want to change the password
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUpdateTeacher(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Update Teacher"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
