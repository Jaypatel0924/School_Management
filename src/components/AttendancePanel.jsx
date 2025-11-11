// import React, { useState, useEffect } from 'react';
// import { Check, X, Save } from 'lucide-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AttendancePanel = ({ grade, section }) => {
//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

//   useEffect(() => {
//     if (grade && section) {
//       fetchStudents();
//     }
//   }, [grade, section]);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/students', {
//         params: { grade, section }
//       });
//       const studentList = response.data.data.students;
//       setStudents(studentList);

//       // Initialize attendance state
//       const attendanceState = {};
//       studentList.forEach(student => {
//         attendanceState[student._id] = 'Present';
//       });
//       setAttendance(attendanceState);
//     } catch (error) {
//       toast.error('Failed to fetch students');
//     }
//   };

//   const handleAttendanceChange = (studentId, status) => {
//     setAttendance(prev => ({
//       ...prev,
//       [studentId]: status
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
//         studentId,
//         status,
//         date,
//         grade,
//         section
//       }));

//       await axios.post('http://localhost:5000/api/attendance/bulk', {
//         attendanceRecords: attendanceData,
//         date,
//         grade,
//         section
//       });

//       toast.success('Attendance marked successfully');
//     } catch (error) {
//       toast.error('Failed to mark attendance');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Mark Attendance</h2>
//         <div className="flex items-center space-x-4">
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="input-field"
//           />
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="btn-primary flex items-center"
//           >
//             <Save className="h-5 w-5 mr-2" />
//             {loading ? 'Saving...' : 'Save Attendance'}
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Roll No
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {students.map((student) => (
//               <tr key={student._id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {student.rollNumber}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{student.name}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center space-x-4">
//                     <button
//                       onClick={() => handleAttendanceChange(student._id, 'Present')}
//                       className={`p-2 rounded-full ${
//                         attendance[student._id] === 'Present'
//                           ? 'bg-green-100 text-green-600'
//                           : 'bg-gray-100 text-gray-400'
//                       }`}
//                     >
//                       <Check className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleAttendanceChange(student._id, 'Absent')}
//                       className={`p-2 rounded-full ${
//                         attendance[student._id] === 'Absent'
//                           ? 'bg-red-100 text-red-600'
//                           : 'bg-gray-100 text-gray-400'
//                       }`}
//                     >
//                       <X className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AttendancePanel;
import React, { useState, useEffect } from "react";
import { Check, X, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const AttendancePanel = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedGrade, setSelectedGrade] = useState("Grade 8");
  const [selectedSection, setSelectedSection] = useState("Section A");

  const grades = ["Grade 8", "Grade 9", "Grade 10"];
  const sections = ["Section A", "Section B", "Section C"];

  useEffect(() => {
    if (selectedGrade && selectedSection) {
      fetchStudents();
    }
  }, [selectedGrade, selectedSection]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students", {
        params: {
          grade: selectedGrade,
          section: selectedSection,
        },
      });
      const studentList = response.data.data.students;
      setStudents(studentList);

      // Initialize attendance state
      const attendanceState = {};
      studentList.forEach((student) => {
        attendanceState[student._id] = "Present";
      });
      setAttendance(attendanceState);
    } catch (error) {
      toast.error("Failed to fetch students");
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const attendanceData = Object.entries(attendance).map(
        ([studentId, status]) => ({
          studentId,
          status,
          date,
          grade: selectedGrade,
          section: selectedSection,
        })
      );

      await axios.post("http://localhost:5000/api/attendance/bulk", {
        attendanceRecords: attendanceData,
        date,
        grade: selectedGrade,
        section: selectedSection,
      });

      // Create notifications for absent students
      // const absentStudents = Object.entries(attendance)
      //   .filter(([_, status]) => status === "Absent")
      //   .map(([studentId]) => studentId);

      // if (absentStudents.length > 0) {
      //   await axios.post("http://localhost:5000/api/notifications/bulk-create", {
      //     studentIds: absentStudents,
      //     message: `You were marked absent on ${new Date(date).toLocaleDateString()}`,
      //     type: "attendance",
      //     date: date
      //   });
      // }

      toast.success("Attendance marked successfully");
    } catch (error) {
      toast.error("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mark Attendance</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="input-field"
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
            className="input-field"
          >
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {student.studentId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        handleAttendanceChange(student._id, "Present")
                      }
                      className={`p-2 rounded-full ${
                        attendance[student._id] === "Present"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleAttendanceChange(student._id, "Absent")
                      }
                      className={`p-2 rounded-full ${
                        attendance[student._id] === "Absent"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePanel;
