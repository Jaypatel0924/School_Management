// import React, { useState, useEffect } from 'react';
// import { Search, Download, Upload, Plus, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const Results = () => {
//   const { userRole } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState([]);
//   const [showAddResult, setShowAddResult] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedGrade, setSelectedGrade] = useState('');
//   const [resultFile, setResultFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [downloadLoading, setDownloadLoading] = useState({});

//   const [formData, setFormData] = useState({
//     grade: 'Grade 8',
//     examType: 'Midterm',
//     subject: '',
//   });

//   useEffect(() => {
//     fetchResults();
//   }, [selectedGrade]);

//   const fetchResults = async () => {
//     try {
//       setLoading(true);
//       let endpoint = 'http://localhost:5000/api/results';

//       if (userRole === 'admin' || userRole === 'teacher' ) {
//         endpoint = selectedGrade
//           ? `http://localhost:5000/api/results/grade/${selectedGrade}`
//           : `http://localhost:5000/api/results`;
//       }
//       if(userRole==='teacher')
//       {
//         endpoint=`http://localhost:5000/api/results`
//       }

//       if(userRole==='student')
//       {
//         endpoint = `http://localhost:5000/api/results/my-results`;
//       }
//       const response = await axios.get(endpoint);
//       setResults(response.data.data.results);
//     } catch (error) {
//       toast.error('Failed to fetch results');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!resultFile) {
//       toast.error('Please select a file');
//       return;
//     }

//     try {
//       setLoading(true);
//       setUploadProgress(0);

//       // Create FormData for file upload
//       const formDataToSend = new FormData();
//       formDataToSend.append('grade', formData.grade);
//       formDataToSend.append('examType', formData.examType);
//       formDataToSend.append('subject', formData.subject);
//       formDataToSend.append('resultFile', resultFile);

//       // Upload file to backend
//       const response = await axios.post('http://localhost:5000/api/results/upload', formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setUploadProgress(percentCompleted);
//         },
//       });

//       toast.success('Result uploaded successfully');
//       setShowAddResult(false);
//       setFormData({
//         grade: 'Grade 8',
//         examType: 'Midterm',
//         subject: '',
//       });
//       setResultFile(null);
//       setUploadProgress(0);
//       fetchResults();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to upload result');
//       setUploadProgress(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteResult = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this result?')) {
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:5000/api/results/${id}`);
//       toast.success('Result deleted successfully');
//       fetchResults();
//     } catch (error) {
//       toast.error('Failed to delete result');
//     }
//   };

//   // const handleDownload = async (resultId) => {
//   //   try {
//   //     setDownloadLoading(prev => ({ ...prev, [resultId]: true }));

//   //     // Use axios to get the file with responseType blob
//   //     const response = await axios.get(`http://localhost:5000/api/results/${resultId}/download`, {
//   //       responseType: 'blob'
//   //     });

//   //     // Get filename from Content-Disposition header if available
//   //     const contentDisposition = response.headers['content-disposition'];
//   //     let filename = 'result-file';

//   //     if (contentDisposition) {
//   //       const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
//   //       if (filenameMatch && filenameMatch[1]) {
//   //         filename = filenameMatch[1];
//   //       }
//   //     }

//   //     // Create a blob URL and trigger download
//   //     const url = window.URL.createObjectURL(new Blob([response.data]));
//   //     const link = document.createElement('a');
//   //     link.href = url;
//   //     link.setAttribute('download', filename);
//   //     document.body.appendChild(link);
//   //     link.click();

//   //     // Clean up
//   //     window.URL.revokeObjectURL(url);
//   //     document.body.removeChild(link);
//   //     toast.success('Download started');
//   //   } catch (error) {
//   //     console.error('Download error:', error);
//   //     toast.error('Failed to download result');
//   //   } finally {
//   //     setDownloadLoading(prev => ({ ...prev, [resultId]: false }));
//   //   }
//   // };

//   // const handleDownload = async (resultId) => {
//   //   try {
//   //     setDownloadLoading(prev => ({ ...prev, [resultId]: true }));

//   //     // First, try the direct approach
//   //     try {
//   //       const response = await axios.get(`http://localhost:5000/api/results/${resultId}/download`, {
//   //         responseType: 'blob'
//   //       });

//   //       // Check if we actually got a blob and not an error JSON
//   //       const contentType = response.headers['content-type'];
//   //       if (contentType && contentType.includes('application/json')) {
//   //         // We likely got an error response
//   //         const reader = new FileReader();
//   //         reader.onload = function() {
//   //           try {
//   //             const errorJson = JSON.parse(reader.result);
//   //             throw new Error(errorJson.message || 'Download failed');
//   //           } catch (e) {
//   //             toast.error(`Download failed: ${e.message}`);
//   //           }
//   //         };
//   //         reader.readAsText(response.data);
//   //         return;
//   //       }

//   //       // Extract filename
//   //       let filename = 'result-file';
//   //       const contentDisposition = response.headers['content-disposition'];
//   //       if (contentDisposition) {
//   //         const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
//   //         if (filenameMatch && filenameMatch[1]) {
//   //           filename = filenameMatch[1];
//   //         }
//   //       } else {
//   //         // Use data from the results array
//   //         const result = results.find(r => r._id === resultId);
//   //         if (result) {
//   //           filename = `${result.subject || 'Subject'}_${result.examType || 'Exam'}_${result.grade || 'Grade'}.pdf`;
//   //         }
//   //       }

//   //       // Create and trigger download
//   //       const url = window.URL.createObjectURL(new Blob([response.data]));
//   //       const link = document.createElement('a');
//   //       link.href = url;
//   //       link.setAttribute('download', filename);
//   //       document.body.appendChild(link);
//   //       link.click();

//   //       // Clean up
//   //       setTimeout(() => {
//   //         window.URL.revoObjectURL(url);
//   //         document.body.removeChild(link);
//   //       }, 200);

//   //       toast.success('Download started');
//   //     } catch (directDownloadError) {
//   //       console.error('Direct download error:', directDownloadError);

//   //       // If direct download fails, try a fallback approach
//   //       const result = results.find(r => r._id === resultId);
//   //       if (result && result.resultFileUrl) {
//   //         // Use toast.success or toast.error instead of toast.info
//   //         toast.success('Trying alternative download method...');

//   //         // You could try to open the URL in a new tab as a last resort
//   //         window.open(result.resultFileUrl, '_blank');
//   //       } else {
//   //         toast.error('Download failed and no fallback URL available');
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error('Download error:', error);
//   //     toast.error(`Failed to download: ${error.message}`);
//   //   } finally {
//   //     setDownloadLoading(prev => ({ ...prev, [resultId]: false }));
//   //   }
//   // };

//   const handleDownload = async (resultId) => {
//     try {
//       setDownloadLoading(prev => ({ ...prev, [resultId]: true }));

//       // First, try the direct approach
//       try {
//         const response = await axios.get(`http://localhost:5000/api/results/${resultId}/download`, {
//           responseType: 'blob',
//           timeout: 30000 // 30 second timeout
//         });

//         // Check if we actually got a blob and not an error JSON
//         const contentType = response.headers['content-type'];
//         if (contentType && contentType.includes('application/json')) {
//           // We likely got an error response
//           const reader = new FileReader();
//           reader.onload = function() {
//             try {
//               const errorJson = JSON.parse(reader.result);
//               throw new Error(errorJson.message || 'Download failed');
//             } catch (e) {
//               toast.error(`Download failed: ${e.message}`);
//             }
//           };
//           reader.readAsText(response.data);
//           return;
//         }

//         // Extract filename
//         let filename = 'result-file.pdf';
//         const contentDisposition = response.headers['content-disposition'];
//         if (contentDisposition) {
//           const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
//           if (filenameMatch && filenameMatch[1]) {
//             filename = filenameMatch[1];
//           }
//         } else {
//           // Use data from the results array
//           const result = results.find(r => r._id === resultId);
//           if (result) {
//             filename = `${result.subject || 'Subject'}_${result.examType || 'Exam'}_${result.grade || 'Grade'}.pdf`;
//           }
//         }

//         // Create and trigger download
//         const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType || 'application/pdf' }));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', filename);
//         document.body.appendChild(link);
//         link.click();

//         // Clean up
//         setTimeout(() => {
//           window.URL.revokeObjectURL(url);
//           document.body.removeChild(link);
//         }, 200);

//         toast.success('Download started');
//       } catch (directDownloadError) {
//         console.error('Direct download error:', directDownloadError);

//         // If direct download fails, try a fallback approach
//         const result = results.find(r => r._id === resultId);
//         if (result && result.resultFileUrl) {
//           toast.success('Trying alternative download method...');

//           // Open in a new tab as fallback
//           window.open(result.resultFileUrl, '_blank');
//         } else {
//           toast.error('Download failed and no fallback URL available');
//         }
//       }
//     } catch (error) {
//       console.error('Download error:', error);
//       toast.error(`Failed to download: ${error.message}`);
//     } finally {
//       setDownloadLoading(prev => ({ ...prev, [resultId]: false }));
//     }
//   };

//   return (
//     <div className="space-y-16 py-8">
//       {/* Header */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">Academic Results</h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           View and download academic results and performance reports.
//         </p>
//       </section>

//       {/* Search and Filters */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search by subject..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="input-field"
//               />
//             </div>
//             {(userRole === 'admin' || userRole === 'teacher') && (
//               <>
//                 <div className="w-full md:w-48">
//                   <select
//                     value={selectedGrade}
//                     onChange={(e) => setSelectedGrade(e.target.value)}
//                     className="input-field"
//                   >
//                     <option value="">All Grades</option>
//                     <option>Grade 8</option>
//                     <option>Grade 9</option>
//                     <option>Grade 10</option>
//                   </select>
//                 </div>
//                 <button
//                   onClick={() => setShowAddResult(true)}
//                   className="btn-primary flex items-center justify-center"
//                 >
//                   <Upload className="h-5 w-5 mr-2" />
//                   Upload Result
//                 </button>
//               </>
//             )}
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
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Subject
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Exam Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Grade
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Upload Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {results
//                   .filter(result => {
//                     const subject = result.subject || '';
//                     return subject.toLowerCase().includes(searchTerm.toLowerCase());
//                   })
//                   .map((result) => (
//                     <tr key={result._id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {result.subject || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {result.examType || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {result.grade || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {result.uploadDate
//                             ? new Date(result.uploadDate).toLocaleDateString()
//                             : 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-4">
//                           <button
//                             onClick={() => handleDownload(result._id)}
//                             className="text-indigo-600 hover:text-indigo-900 flex items-center"
//                             title="Download"
//                             disabled={downloadLoading[result._id]}
//                           >
//                             {downloadLoading[result._id] ? (
//                               <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
//                             ) : (
//                               <Download className="h-5 w-5" />
//                             )}
//                           </button>
//                           {userRole === 'admin' && (
//                             <button
//                               onClick={() => handleDeleteResult(result._id)}
//                               className="text-red-600 hover:text-red-900"
//                               title="Delete"
//                             >
//                               <X className="h-5 w-5" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//             {results.length === 0 && (
//               <div className="p-6 text-center text-gray-500">
//                 No results found
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Upload Result Modal */}
//       {showAddResult && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h2 className="text-2xl font-bold mb-6">Upload Result</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Grade
//                 </label>
//                 <select
//                   value={formData.grade}
//                   onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
//                   className="input-field"
//                   required
//                 >
//                   <option>Grade 8</option>
//                   <option>Grade 9</option>
//                   <option>Grade 10</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Exam Type
//                 </label>
//                 <select
//                   value={formData.examType}
//                   onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
//                   className="input-field"
//                   required
//                 >
//                   <option>Midterm</option>
//                   <option>Final</option>
//                   <option>Quiz</option>
//                   <option>Test</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.subject}
//                   onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
//                   className="input-field"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Result File (PDF, DOC, XLS)
//                 </label>
//                 <input
//                   type="file"
//                   onChange={(e) => setResultFile(e.target.files[0])}
//                   className="input-field"
//                   accept=".pdf,.doc,.docx,.xls,.xlsx"
//                   required
//                 />
//               </div>

//               {/* Upload Progress Bar */}
//               {uploadProgress > 0 && uploadProgress < 100 && (
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-indigo-600 h-2.5 rounded-full"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               )}

//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddResult(false);
//                     setUploadProgress(0);
//                   }}
//                   className="btn-secondary"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="btn-primary"
//                 >
//                   {loading ? 'Uploading...' : 'Upload Result'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Results;

// Today Changes

// import React, { useState, useEffect } from 'react';
// import { Search, Download, Upload, Plus, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const Results = () => {
//   const { userRole } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState([]);
//   const [showAddResult, setShowAddResult] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedGrade, setSelectedGrade] = useState('');
//   const [resultFile, setResultFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [downloadLoading, setDownloadLoading] = useState({});

//   const [formData, setFormData] = useState({
//     grade: 'Grade 8',
//     examType: 'Midterm',
//     subject: '',
//   });

//   useEffect(() => {
//     fetchResults();
//   }, [selectedGrade]);

//   const fetchResults = async () => {
//     try {
//       setLoading(true);
//       let endpoint = 'http://localhost:5000/api/results';

//       if (userRole === 'admin' || userRole === 'teacher') {
//         endpoint = selectedGrade
//           ? `http://localhost:5000/api/results/grade/${selectedGrade}`
//           : `http://localhost:5000/api/results`;
//       }

//       if (userRole === 'student') {
//         endpoint = `http://localhost:5000/api/results/my-results`;
//       }

//       const response = await axios.get(endpoint);
//       setResults(response.data.data.results);
//     } catch (error) {
//       toast.error('Failed to fetch results');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!resultFile) {
//       toast.error('Please select a file');
//       return;
//     }

//     try {
//       setLoading(true);
//       setUploadProgress(0);

//       const formDataToSend = new FormData();
//       formDataToSend.append('grade', formData.grade);
//       formDataToSend.append('examType', formData.examType);
//       formDataToSend.append('subject', formData.subject);
//       formDataToSend.append('resultFile', resultFile);

//       const response = await axios.post('http://localhost:5000/api/results/upload', formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setUploadProgress(percentCompleted);
//         },
//       });

//       toast.success('Result uploaded successfully');
//       setShowAddResult(false);
//       setFormData({
//         grade: 'Grade 8',
//         examType: 'Midterm',
//         subject: '',
//       });
//       setResultFile(null);
//       setUploadProgress(0);
//       fetchResults();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to upload result');
//       setUploadProgress(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteResult = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this result?')) {
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:5000/api/results/${id}`);
//       toast.success('Result deleted successfully');
//       fetchResults();
//     } catch (error) {
//       toast.error('Failed to delete result');
//     }
//   };

//   const handleDownload = async (resultId) => {
//     try {
//       setDownloadLoading(prev => ({ ...prev, [resultId]: true }));

//       const result = results.find(r => r._id === resultId);
//       if (!result) {
//         throw new Error('Result not found');
//       }

//       // Create a hidden anchor tag to trigger the download
//       const link = document.createElement('a');
//       link.href = `http://localhost:5000/api/results/${resultId}/download`;
//       link.setAttribute('download', result.originalName || `${result.subject}_${result.examType}_${result.grade}.pdf`);
//       link.style.display = 'none';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       toast.success('Download started');
//     } catch (error) {
//       console.error('Download error:', error);
//       toast.error(`Failed to download: ${error.message}`);
//     } finally {
//       setDownloadLoading(prev => ({ ...prev, [resultId]: false }));
//     }
//   };

//   return (
//     <div className="space-y-16 py-8">
//       {/* Header */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">Academic Results</h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           View and download academic results and performance reports.
//         </p>
//       </section>

//       {/* Search and Filters */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search by subject..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             {(userRole === 'admin' || userRole === 'teacher') && (
//               <>
//                 <div className="w-full md:w-48">
//                   <select
//                     value={selectedGrade}
//                     onChange={(e) => setSelectedGrade(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">All Grades</option>
//                     <option>Grade 8</option>
//                     <option>Grade 9</option>
//                     <option>Grade 10</option>
//                   </select>
//                 </div>
//                 <button
//                   onClick={() => setShowAddResult(true)}
//                   className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   <Upload className="h-5 w-5 mr-2" />
//                   Upload Result
//                 </button>
//               </>
//             )}
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
//                     Subject
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Exam Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Grade
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Upload Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {results
//                   .filter(result => {
//                     const subject = result.subject || '';
//                     return subject.toLowerCase().includes(searchTerm.toLowerCase());
//                   })
//                   .map((result) => (
//                     <tr key={result._id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {result.subject || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {result.examType || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {result.grade || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {result.uploadDate
//                             ? new Date(result.uploadDate).toLocaleDateString()
//                             : 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-4">
//                           <button
//                             onClick={() => handleDownload(result._id)}
//                             className="text-indigo-600 hover:text-indigo-900 flex items-center"
//                             title="Download"
//                             disabled={downloadLoading[result._id]}
//                           >
//                             {downloadLoading[result._id] ? (
//                               <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
//                             ) : (
//                               <Download className="h-5 w-5" />
//                             )}
//                           </button>
//                           {userRole === 'admin' && (
//                             <button
//                               onClick={() => handleDeleteResult(result._id)}
//                               className="text-red-600 hover:text-red-900"
//                               title="Delete"
//                             >
//                               <X className="h-5 w-5" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//             {results.length === 0 && !loading && (
//               <div className="p-6 text-center text-gray-500">
//                 No results found
//               </div>
//             )}
//             {loading && (
//               <div className="p-6 text-center">
//                 <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Upload Result Modal */}
//       {showAddResult && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">Upload Result</h2>
//               <button
//                 onClick={() => {
//                   setShowAddResult(false);
//                   setUploadProgress(0);
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Grade
//                 </label>
//                 <select
//                   value={formData.grade}
//                   onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   required
//                 >
//                   <option>Grade 8</option>
//                   <option>Grade 9</option>
//                   <option>Grade 10</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Exam Type
//                 </label>
//                 <select
//                   value={formData.examType}
//                   onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   required
//                 >
//                   <option>Midterm</option>
//                   <option>Final</option>
//                   <option>Quiz</option>
//                   <option>Test</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.subject}
//                   onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Result File (PDF, DOC, XLS)
//                 </label>
//                 <div className="mt-1 flex items-center">
//                   <input
//                     type="file"
//                     onChange={(e) => setResultFile(e.target.files[0])}
//                     className="block w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-indigo-50 file:text-indigo-700
//                       hover:file:bg-indigo-100"
//                     accept=".pdf,.doc,.docx,.xls,.xlsx"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Upload Progress Bar */}
//               {uploadProgress > 0 && uploadProgress < 100 && (
//                 <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
//                   <div
//                     className="bg-indigo-600 h-2.5 rounded-full"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                   <div className="text-xs text-gray-500 mt-1 text-right">
//                     {uploadProgress}% uploaded
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddResult(false);
//                     setUploadProgress(0);
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? 'Uploading...' : 'Upload Result'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Results;

// import React, { useState, useEffect } from 'react';
// import { Search, Download, Upload, Plus, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const Results = () => {
//   const { userRole } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState([]);
//   const [showAddResult, setShowAddResult] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedGrade, setSelectedGrade] = useState('');
//   const [resultFile, setResultFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const [formData, setFormData] = useState({
//     grade: 'Grade 8',
//     examType: 'Midterm',
//     subject: '',
//   });

//   useEffect(() => {
//     fetchResults();
//   }, [selectedGrade]);

//   const fetchResults = async () => {
//     try {
//       setLoading(true);
//       let endpoint = 'http://localhost:5000/api/results';

//       if (userRole === 'admin' || userRole === 'teacher') {
//         endpoint = selectedGrade
//           ? `http://localhost:5000/api/results/grade/${selectedGrade}`
//           : 'http://localhost:5000/api/results';
//       }

//       const response = await axios.get(endpoint);
//       setResults(response.data.data.results);
//     } catch (error) {
//       toast.error('Failed to fetch results');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!resultFile) {
//       toast.error('Please select a file');
//       return;
//     }

//     try {
//       setLoading(true);
//       setUploadProgress(0);

//       // Create FormData for file upload
//       const formDataToSend = new FormData();
//       formDataToSend.append('grade', formData.grade);
//       formDataToSend.append('examType', formData.examType);
//       formDataToSend.append('subject', formData.subject);
//       formDataToSend.append('resultFile', resultFile);

//       // Upload file to backend
//       const response = await axios.post(
//         'http://localhost:5000/api/results',
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(percentCompleted);
//           },
//         }
//       );

//       toast.success('Result uploaded successfully');
//       setShowAddResult(false);
//       setFormData({
//         grade: 'Grade 8',
//         examType: 'Midterm',
//         subject: '',
//       });
//       setResultFile(null);
//       setUploadProgress(0);
//       fetchResults();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to upload result');
//       setUploadProgress(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteResult = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this result?')) {
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:5000/api/results/${id}`);
//       toast.success('Result deleted successfully');
//       fetchResults();
//     } catch (error) {
//       toast.error('Failed to delete result');
//     }
//   };

//   // const handleDownload = async (resultId) => {
//   //   try {
//   //     window.open(
//   //       `http://localhost:5000/api/results/${resultId}/download`,
//   //       '_blank'
//   //     );
//   //   } catch (error) {
//   //     toast.error('Failed to download result');
//   //   }
//   // };
//   const handleDownload = async (resultId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/results/${resultId}/download`,
//         {
//           responseType: 'blob', // Important for file downloads
//         }
//       );

//       // Create a blob from the response
//       const url = window.URL.createObjectURL(new Blob([response.data]));

//       // Create a temporary anchor element to trigger download
//       const link = document.createElement('a');
//       link.href = url;

//       // Try to get the filename from content-disposition header
//       const contentDisposition = response.headers['content-disposition'];
//       let filename = 'result.pdf'; // default filename
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1];
//         }
//       }

//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();

//       // Clean up
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       toast.error('Failed to download result');
//       console.error('Download error:', error);
//     }
//   };

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

//       {/* Search and Filters */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 placeholder="Search by subject..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="input-field"
//               />
//             </div>
//             {(userRole === 'admin' || userRole === 'teacher') && (
//               <>
//                 <div className="w-full md:w-48">
//                   <select
//                     value={selectedGrade}
//                     onChange={(e) => setSelectedGrade(e.target.value)}
//                     className="input-field"
//                   >
//                     <option value="">All Grades</option>
//                     <option>Grade 8</option>
//                     <option>Grade 9</option>
//                     <option>Grade 10</option>
//                   </select>
//                 </div>
//                 <button
//                   onClick={() => setShowAddResult(true)}
//                   className="btn-primary flex items-center justify-center"
//                 >
//                   <Upload className="h-5 w-5 mr-2" />
//                   Upload Result
//                 </button>
//               </>
//             )}
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
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Subject
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Exam Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Grade
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Upload Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {results
//                   .filter((result) => {
//                     const subject = result.subject || '';
//                     return subject
//                       .toLowerCase()
//                       .includes(searchTerm.toLowerCase());
//                   })
//                   .map((result) => (
//                     <tr key={result._id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {result.subject || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {result.examType || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {result.grade || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {result.uploadDate
//                             ? new Date(result.uploadDate).toLocaleDateString()
//                             : 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-4">
//                           <button
//                             onClick={() => handleDownload(result._id)}
//                             className="text-indigo-600 hover:text-indigo-900"
//                             title="Download"
//                           >
//                             <Download className="h-5 w-5" />
//                           </button>
//                           {userRole === 'admin' && (
//                             <button
//                               onClick={() => handleDeleteResult(result._id)}
//                               className="text-red-600 hover:text-red-900"
//                               title="Delete"
//                             >
//                               <X className="h-5 w-5" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//             {results.length === 0 && (
//               <div className="p-6 text-center text-gray-500">
//                 No results found
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Upload Result Modal */}
//       {showAddResult && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h2 className="text-2xl font-bold mb-6">Upload Result</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Grade
//                 </label>
//                 <select
//                   value={formData.grade}
//                   onChange={(e) =>
//                     setFormData({ ...formData, grade: e.target.value })
//                   }
//                   className="input-field"
//                   required
//                 >
//                   <option>Grade 8</option>
//                   <option>Grade 9</option>
//                   <option>Grade 10</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Exam Type
//                 </label>
//                 <select
//                   value={formData.examType}
//                   onChange={(e) =>
//                     setFormData({ ...formData, examType: e.target.value })
//                   }
//                   className="input-field"
//                   required
//                 >
//                   <option>Midterm</option>
//                   <option>Final</option>
//                   <option>Quiz</option>
//                   <option>Test</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.subject}
//                   onChange={(e) =>
//                     setFormData({ ...formData, subject: e.target.value })
//                   }
//                   className="input-field"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Result File (PDF, DOC, XLS)
//                 </label>
//                 <input
//                   type="file"
//                   onChange={(e) => setResultFile(e.target.files[0])}
//                   className="input-field"
//                   accept=".pdf,.doc,.docx,.xls,.xlsx"
//                   required
//                 />
//               </div>

//               {/* Upload Progress Bar */}
//               {uploadProgress > 0 && uploadProgress < 100 && (
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-indigo-600 h-2.5 rounded-full"
//                     style={{ width: `${uploadProgress}%` }}
//                   ></div>
//                 </div>
//               )}

//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowAddResult(false);
//                     setUploadProgress(0);
//                   }}
//                   className="btn-secondary"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="btn-primary"
//                 >
//                   {loading ? 'Uploading...' : 'Upload Result'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Results;

import React, { useState, useEffect } from "react";
import { Download, Upload, X, FileText, Search, Filter } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Results = () => {
  const { userRole } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    grade: "Grade 8",
    section: "Section A",
    type: "Mid Term",
    file: null,
  });

  useEffect(() => {
    fetchResults();
  }, [userRole]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const endpoint =
        userRole === "admin" || userRole === "teacher"
          ? "http://localhost:5000/api/results"
          : "http://localhost:5000/api/results/my-results";
      const response = await axios.get(endpoint);
      setResults(response.data.data.results);
    } catch (error) {
      toast.error("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(uploadForm).forEach((key) => {
        if (key === "file") {
          formData.append("file", uploadForm.file);
        } else {
          formData.append(key, uploadForm[key]);
        }
      });

      await axios.post("http://localhost:5000/api/results", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Result uploaded successfully");
      setShowUploadModal(false);
      fetchResults();
      setUploadForm({
        title: "",
        description: "",
        grade: "Grade 8",
        section: "Section A",
        type: "Mid Term",
        file: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload result");
    }
  };

  const handleDownload = async (resultId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/results/download/${resultId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "result.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download result");
    }
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/results/${resultId}`);
      toast.success("Result deleted successfully");
      fetchResults();
    } catch (error) {
      toast.error("Failed to delete result");
    }
  };

  const filteredResults = results.filter((result) => {
    const title = result.title || "";
    const description = result.description || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || result.type === selectedType;
    const matchesGrade =
      selectedGrade === "All" || result.grade === selectedGrade;
    return matchesSearch && matchesType && matchesGrade;
  });

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Results</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {userRole === "admin"
            ? "Manage and upload student results"
            : "View and download your results"}
        </p>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              <option value="All">All Types</option>
              <option value="Mid Term">Mid Term</option>
              <option value="Final Term">Final Term</option>
              <option value="Unit Test">Unit Test</option>
              <option value="Other">Other</option>
            </select>
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
            {userRole === "admin" && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center justify-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Result
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResults.map((result) => (
              <div
                key={result._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="h-8 w-8 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {result.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {result.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <p>Grade: {result.grade}</p>
                    <p>Section: {result.section}</p>
                    <p>Uploaded by: {result.uploadedBy?.name}</p>
                    <p>
                      Date: {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleDownload(result._id)}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download
                    </button>
                    {userRole === "admin" && (
                      <button
                        onClick={() => handleDelete(result._id)}
                        className="btn-secondary flex-1 flex items-center justify-center"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              {userRole === "admin"
                ? "Upload some results to get started"
                : "No results available for your grade and section"}
            </p>
          </div>
        )}
      </section>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upload Result</h2>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, title: e.target.value })
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
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade
                  </label>
                  <select
                    value={uploadForm.grade}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, grade: e.target.value })
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
                    value={uploadForm.section}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, section: e.target.value })
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
                  value={uploadForm.type}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, type: e.target.value })
                  }
                  className="input-field"
                >
                  <option>Mid Term</option>
                  <option>Final Term</option>
                  <option>Unit Test</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Result File (PDF only)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, file: e.target.files[0] })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload Result
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
