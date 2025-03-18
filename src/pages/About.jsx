import React from 'react';
import { BookOpen, Trophy, Users, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Modern Academy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded in 1970, Modern Academy has been a beacon of educational excellence, 
            nurturing young minds and shaping future leaders for over five decades.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Target className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To provide exceptional education that empowers students with knowledge, 
                skills, and values necessary to excel in a rapidly evolving global society 
                while maintaining strong ethical principles.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <Trophy className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To be recognized globally as a leading institution that nurtures 
                innovative thinkers, responsible citizens, and future leaders who 
                contribute positively to society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Academic Excellence</h3>
            <p className="text-gray-600">
              Commitment to the highest standards of education and continuous learning.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Inclusive Community</h3>
            <p className="text-gray-600">
              Fostering a diverse and supportive environment where every student thrives.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Trophy className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Character Development</h3>
            <p className="text-gray-600">
              Building strong moral values and leadership qualities in our students.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-indigo-200">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-indigo-200">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-indigo-200">Expert Faculty</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-indigo-200">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;