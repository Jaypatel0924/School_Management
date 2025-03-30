
// import React from "react";
// import { Search, Download } from "lucide-react";

// const Results = () => {
//   const results = [
//     { id: 1, name: "John Doe", grade: "10A", percentage: 95, rank: 1 },
//     { id: 2, name: "Jane Smith", grade: "10A", percentage: 92, rank: 2 },
//     { id: 3, name: "Mike Johnson", grade: "10B", percentage: 90, rank: 3 },
//   ];

//   return (
//     <div className="space-y-16 py-8">
//       {/* Header */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">
//           Academic Results
//         </h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           View and download academic results and performance reports.
//         </p>
//       </section>

//       {/* Search Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex flex-col md:flex >-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search by name or roll number"
//                 className="input-field"
//               />
//             </div>
//             <div className="w-full md:w-48">
//               <select className="input-field">
//                 <option>Select Class</option>
//                 <option>Class 8</option>
//                 <option>Class 9</option>
//                 <option>Class 10</option>
//               </select>
//             </div>
//             <button className="btn-primary flex items-center justify-center">
//               <Search className="h-5 w-5 mr-2" />
//               Search
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Results Table */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Rank
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Grade
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Percentage
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {results.map((result) => (
//                   <tr key={result.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       #{result.rank}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {result.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {result.grade}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {result.percentage}%
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
//                         <Download className="h-4 w-4 mr-1" />
//                         Download
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       {/* Download Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">
//               Previous Year Results
//             </h3>
//             <button className="btn-secondary w-full flex items-center justify-center">
//               <Download className="h-5 w-5 mr-2" />
//               Download PDF
//             </button>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">Merit List</h3>
//             <button className="btn-secondary w-full flex items-center justify-center">
//               <Download className="h-5 w-5 mr-2" />
//               Download PDF
//             </button>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
//             <button className="btn-secondary w-full flex items-center justify-center">
//               <Download className="h-5 w-5 mr-2" />
//               Download PDF
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Results;
// {
//   /* <boltAction type="file" filePath="src/pages/Results.jsx" */
// }


import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Results = () => {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showAddResult, setShowAddResult] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const [formData, setFormData] = useState({
    // examId: '',
    studentId: '',
    marks: '',
    grade: '',
    remarks: ''
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/my-results');
      console.log(response.data.data.results);
      
      setResults(response.data.data.results);
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/results', formData);
      toast.success('Result added successfully');
      setShowAddResult(false);
      setFormData({
        // examId: '',
        studentId: '',
        marks: '',
        grade: '',
        remarks: ''
      });
      fetchResults();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add result');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResult = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await axios.delete(`http://localhost:5000/api/results/${resultId}`);
        toast.success('Result deleted successfully');
        fetchResults();
      } catch (error) {
        toast.error('Failed to delete result');
      }
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || result.exam.grade === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Academic Results</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          View and download academic results and performance reports.
        </p>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or roll number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="w-full md:w-48">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input-field"
              >
                <option value="">All Classes</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
              </select>
            </div>
            {userRole === 'admin' && (
              <button 
                onClick={() => setShowAddResult(true)}
                className="btn-primary flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Result
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result) => (
                    <tr key={result._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {result.student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Roll No: {result.student.rollNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{result.exam.name}</div>
                        <div className="text-sm text-gray-500">{result.exam.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {result.marks}/{result.exam.maxMarks}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <Download className="h-5 w-5" />
                        </button>
                        {userRole === 'admin' && (
                          <button 
                            onClick={() => handleDeleteResult(result._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add Result Modal */}
      {showAddResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Result</h2>
            <form onSubmit={handleAddResult} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam ID
                </label>
                <input
                  type="text"
                  value={formData.examId}
                  onChange={(e) => setFormData({...formData, examId: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  value={formData.marks}
                  onChange={(e) => setFormData({...formData, marks: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddResult(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Adding...' : 'Add Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;