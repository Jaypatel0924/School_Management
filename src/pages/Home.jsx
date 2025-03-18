import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Users, Calendar as CalendarIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-6">Welcome to Modern Academy</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Empowering minds, shaping futures, and building tomorrow's leaders through excellence in education.
          </p>
          <Link
            to="/admissions"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Award className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Excellence in Education</h3>
            <p className="text-gray-600">
              Consistently ranked among the top schools with outstanding academic achievements.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Users className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
            <p className="text-gray-600">
              Learn from experienced educators dedicated to nurturing young minds.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <BookOpen className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Modern Facilities</h3>
            <p className="text-gray-600">
              State-of-the-art infrastructure supporting comprehensive learning.
            </p>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Latest News & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={`https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`}
                  alt="Event"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>March {item}, 2024</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Annual Science Fair</h3>
                  <p className="text-gray-600 mb-4">
                    Join us for an exciting showcase of student projects and innovations.
                  </p>
                  <Link
                    to="/calendar"
                    className="text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8">
            Take the first step towards a bright future with Modern Academy.
          </p>
          <div className="space-x-4">
            <Link
              to="/contact"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Contact Us
            </Link>
            <Link
              to="/admissions"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;