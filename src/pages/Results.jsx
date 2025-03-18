// import React from 'react';
// import { Search, Download } from 'lucide-react';

// const Results = () => {
//   const results = [
//     { id: 1, name: 'John Doe', grade: '10A', percentage: 95, rank: 1 },
//     { id: 2, name: 'Jane Smith', grade: '10A', percentage: 92, rank: 2 },
//     { id: 3, name: 'Mike Johnson', grade: '10B', percentage: 90, rank: 3 },
//   ];

//   return (
//     <div className="space-y-16 py-8">
//       {/* Header */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">Academic Results</h1>
//         <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//           View and download academic results and performance reports.
//         </p>
//       </section>

//       {/* Search Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <div className="flex flex-col md:flex <boltAction type="file" filePath="src/pages/Results.jsx">-row gap-4">
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
//             <h3 className="text-lg font-semibold mb-4">Previous Year Results</h3>
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



import React from "react";
import { Search, Download } from "lucide-react";

const Results = () => {
  const results = [
    { id: 1, name: "John Doe", grade: "10A", percentage: 95, rank: 1 },
    { id: 2, name: "Jane Smith", grade: "10A", percentage: 92, rank: 2 },
    { id: 3, name: "Mike Johnson", grade: "10B", percentage: 90, rank: 3 },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Academic Results
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          View and download academic results and performance reports.
        </p>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex >-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or roll number"
                className="input-field"
              />
            </div>
            <div className="w-full md:w-48">
              <select className="input-field">
                <option>Select Class</option>
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </select>
            </div>
            <button className="btn-primary flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
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
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{result.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Previous Year Results
            </h3>
            <button className="btn-secondary w-full flex items-center justify-center">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Merit List</h3>
            <button className="btn-secondary w-full flex items-center justify-center">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
            <button className="btn-secondary w-full flex items-center justify-center">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Results;
{
  /* <boltAction type="file" filePath="src/pages/Results.jsx" */
}
