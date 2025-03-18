import React from 'react';
import { BookOpen, Download, FileText, Video, Book } from 'lucide-react';

const Resources = () => {
  const resources = {
    books: [
      { id: 1, title: 'Mathematics Textbook - Grade 8', size: '15 MB' },
      { id: 2, title: 'Science Workbook - Grade 9', size: '12 MB' },
      { id: 3, title: 'English Literature - Grade 10', size: '18 MB' }
    ],
    papers: [
      { id: 1, title: 'Mathematics Mock Test 2023', size: '2 MB' },
      { id: 2, title: 'Science Practice Paper', size: '3 MB' },
      { id: 3, title: 'English Sample Paper', size: '1.5 MB' }
    ],
    videos: [
      { id: 1, title: 'Chemistry Lab Experiments', duration: '45 mins' },
      { id: 2, title: 'Physics Concepts Explained', duration: '30 mins' },
      { id: 3, title: 'Biology Virtual Tour', duration: '25 mins' }
    ]
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Learning Resources</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Access our comprehensive collection of educational materials.
        </p>
      </section>

      {/* Book Lists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Book className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold">Digital Books</h2>
            </div>
            <div className="space-y-4">
              {resources.books.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-500">Size: {book.size}</p>
                    </div>
                  </div>
                  <button className="btn-secondary flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Practice Papers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold">Practice Papers</h2>
            </div>
            <div className="space-y-4">
              {resources.papers.map((paper) => (
                <div
                  key={paper.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <h3 className="font-medium">{paper.title}</h3>
                      <p className="text-sm text-gray-500">Size: {paper.size}</p>
                    </div>
                  </div>
                  <button className="btn-secondary flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Video className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-bold">Video Lectures</h2>
            </div>
            <div className="space-y-4">
              {resources.videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Video className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-gray-500">Duration: {video.duration}</p>
                    </div>
                  </div>
                  <button className="btn-primary flex items-center">
                    Watch Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;