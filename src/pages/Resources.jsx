// import React from 'react';
// import { BookOpen, Download, FileText, Video, Book } from 'lucide-react';

// const Resources = () => {
//   const resources = {
//     books: [
//       { id: 1, title: 'Mathematics Textbook - Grade 8', size: '15 MB' },
//       { id: 2, title: 'Science Workbook - Grade 9', size: '12 MB' },
//       { id: 3, title: 'English Literature - Grade 10', size: '18 MB' }
//     ],
//     papers: [
//       { id: 1, title: 'Mathematics Mock Test 2023', size: '2 MB' },
//       { id: 2, title: 'Science Practice Paper', size: '3 MB' },
//       { id: 3, title: 'English Sample Paper', size: '1.5 MB' }
//     ],
//     videos: [
//       { id: 1, title: 'Chemistry Lab Experiments', duration: '45 mins' },
//       { id: 2, title: 'Physics Concepts Explained', duration: '30 mins' },
//       { id: 3, title: 'Biology Virtual Tour', duration: '25 mins' }
//     ]
//   };

//   return (
//     <div className="space-y-16 py-8">
//       {/* Header */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">Learning Resources</h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           Access our comprehensive collection of educational materials.
//         </p>
//       </section>

//       {/* Book Lists */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-6">
//             <div className="flex items-center mb-6">
//               <Book className="h-6 w-6 text-indigo-600 mr-2" />
//               <h2 className="text-2xl font-bold">Digital Books</h2>
//             </div>
//             <div className="space-y-4">
//               {resources.books.map((book) => (
//                 <div
//                   key={book.id}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center">
//                     <BookOpen className="h-5 w-5 text-indigo-600 mr-3" />
//                     <div>
//                       <h3 className="font-medium">{book.title}</h3>
//                       <p className="text-sm text-gray-500">Size: {book.size}</p>
//                     </div>
//                   </div>
//                   <button className="btn-secondary flex items-center">
//                     <Download className="h-4 w-4 mr-2" />
//                     Download PDF
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Practice Papers */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-6">
//             <div className="flex items-center mb-6">
//               <FileText className="h-6 w-6 text-indigo-600 mr-2" />
//               <h2 className="text-2xl font-bold">Practice Papers</h2>
//             </div>
//             <div className="space-y-4">
//               {resources.papers.map((paper) => (
//                 <div
//                   key={paper.id}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center">
//                     <FileText className="h-5 w-5 text-indigo-600 mr-3" />
//                     <div>
//                       <h3 className="font-medium">{paper.title}</h3>
//                       <p className="text-sm text-gray-500">Size: {paper.size}</p>
//                     </div>
//                   </div>
//                   <button className="btn-secondary flex items-center">
//                     <Download className="h-4 w-4 mr-2" />
//                     Download
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Video Resources */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="p-6">
//             <div className="flex items-center mb-6">
//               <Video className="h-6 w-6 text-indigo-600 mr-2" />
//               <h2 className="text-2xl font-bold">Video Lectures</h2>
//             </div>
//             <div className="space-y-4">
//               {resources.videos.map((video) => (
//                 <div
//                   key={video.id}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center">
//                     <Video className="h-5 w-5 text-indigo-600 mr-3" />
//                     <div>
//                       <h3 className="font-medium">{video.title}</h3>
//                       <p className="text-sm text-gray-500">Duration: {video.duration}</p>
//                     </div>
//                   </div>
//                   <button className="btn-primary flex items-center">
//                     Watch Now
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Resources;

import React, { useState, useEffect } from 'react';
import { BookOpen, Download, FileText, Video, Book, Search, Filter } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Resources = () => {
  const { userRole } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  useEffect(() => {
    fetchMaterials();
  }, [userRole]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const endpoint = userRole === 'teacher' ? 'http://localhost:5000/api/materials' : 'http://localhost:5000/api/materials/student-materials';
      const response = await axios.get(endpoint);
      setMaterials(response.data.data.materials);
    } catch (error) {
      toast.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Notes':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'Presentation':
        return <Video className="h-5 w-5 text-indigo-600" />;
      case 'Worksheet':
        return <BookOpen className="h-5 w-5 text-indigo-600" />;
      default:
        return <Book className="h-5 w-5 text-indigo-600" />;
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || material.type === selectedType;
    const matchesSubject = selectedSubject === 'All' || material.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const subjects = ['All', ...new Set(materials.map(m => m.subject))];
  const types = ['All', 'Notes', 'Presentation', 'Worksheet', 'Reference'];

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Learning Resources</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access our comprehensive collection of educational materials.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
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
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material) => (
              <div key={material._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {getIcon(material.type)}
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {material.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{material.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <p>Subject: {material.subject}</p>
                    <p>Grade: {material.grade}</p>
                    <p>Section: {material.section}</p>
                    {material.uploadedBy && (
                      <p>Uploaded by: {material.uploadedBy.name}</p>
                    )}
                  </div>
                  <a
                    href={material.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Material
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Resources;