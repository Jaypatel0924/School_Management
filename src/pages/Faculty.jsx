import React from 'react';
import { Mail, Phone, Award } from 'lucide-react';

const Faculty = () => {
  const faculty = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Head of Science Department',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      subjects: ['Physics', 'Advanced Science'],
      experience: '15+ years',
      education: 'Ph.D. in Physics',
      awards: ['Best Teacher 2023', 'Research Excellence Award']
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      role: 'Mathematics Department',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      subjects: ['Mathematics', 'Statistics'],
      experience: '12+ years',
      education: 'M.Sc. Mathematics',
      awards: ['Innovation in Teaching 2023']
    },
    {
      id: 3,
      name: 'Dr. Emily Brown',
      role: 'English Department Head',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      subjects: ['English Literature', 'Creative Writing'],
      experience: '10+ years',
      education: 'Ph.D. in Literature',
      awards: ['Excellence in Education 2023']
    }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Faculty</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our dedicated team of educators committed to academic excellence and student success.
        </p>
      </section>

      {/* Faculty Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-4">{member.role}</p>
                
                <div className="space-y-3 text-gray-600">
                  <p><strong>Subjects:</strong> {member.subjects.join(', ')}</p>
                  <p><strong>Experience:</strong> {member.experience}</p>
                  <p><strong>Education:</strong> {member.education}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm text-gray-600">
                      {member.awards.join(' • ')}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button className="flex-1 btn-secondary flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </button>
                  <button className="flex-1 btn-primary flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Stats */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-indigo-200">PhD Faculty</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15:1</div>
              <div className="text-indigo-200">Student-Teacher Ratio</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-indigo-200">Research Papers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30+</div>
              <div className="text-indigo-200">Awards Won</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faculty;