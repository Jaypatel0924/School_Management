import React from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Users, Calendar as CalendarIcon } from "lucide-react";
import HomeImages from "../images/schoolimg.jpg";

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section
        className="relative h-[600px] w-full flex items-center justify-center shadow-2xl transition duration-500 hover:scale-105"
        style={{
          backgroundImage: `url(${HomeImages})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Award className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Excellence in Education
            </h3>
            <p className="text-gray-600">
              Consistently ranked among the top schools with outstanding
              academic achievements.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Users className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
            <p className="text-gray-600">
              Learn from experienced educators dedicated to nurturing young
              minds.
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
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest News & Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event 1: Art Competition */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://static.wixstatic.com/media/f29599_16bfd002ed5d40c0937eba7755e6a360~mv2.png/v1/fill/w_602,h_402,al_c,q_85,enc_auto/f29599_16bfd002ed5d40c0937eba7755e6a360~mv2.png"
                alt="Art Competition"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>April 12, 2025</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Inter-School Art Competition
                </h3>
                <p className="text-gray-600 mb-4">
                  Students will express their creativity through vibrant art
                  pieces. Winners will be awarded on the same day.
                </p>
                <Link
                  to="/calendar"
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Event 2: Earth Day Activities */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://th.bing.com/th/id/OIP.lQIOgESOFmWZzWnGDhSNHAHaE8?rs=1&pid=ImgDetMain"
                alt="Earth Day"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>April 22, 2025</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Earth Day Celebration
                </h3>
                <p className="text-gray-600 mb-4">
                  Join us for a day of planting trees, eco-projects, and
                  awareness campaigns on environmental protection.
                </p>
                <Link
                  to="/calendar"
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Event 3: Quiz Competition */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://th.bing.com/th/id/OIP.sm2oWrIlt0AecaOO0c92hgHaDP?w=328&h=153&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                alt="Quiz Competition"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>April 30, 2025</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Intra-School Quiz Finals
                </h3>
                <p className="text-gray-600 mb-4">
                  Teams from all grades will compete in a knowledge showdown.
                  Come support your house and cheer them on!
                </p>
                <Link
                  to="/calendar"
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8">
            Take the first step towards a bright future with Panchjanya Sikshan
            Sankul.
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
