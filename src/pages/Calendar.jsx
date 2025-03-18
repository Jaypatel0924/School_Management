import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

const Calendar = () => {
  const events = [
    {
      id: 1,
      title: 'Annual Science Fair',
      date: 'March 15, 2024',
      time: '9:00 AM - 4:00 PM',
      location: 'Main Auditorium',
      category: 'Academic',
      description: 'Showcase of student science projects and innovations.'
    },
    {
      id: 2,
      title: 'Parent-Teacher Meeting',
      date: 'March 20, 2024',
      time: '2:00 PM - 6:00 PM',
      location: 'Classroom Blocks',
      category: 'Meeting',
      description: 'Discussion of student progress and performance.'
    },
    {
      id: 3,
      title: 'Sports Day',
      date: 'April 5, 2024',
      time: '8:00 AM - 5:00 PM',
      location: 'Sports Complex',
      category: 'Sports',
      description: 'Annual athletic competition and sports activities.'
    }
  ];

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Meeting', 'Holiday'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(event => event.category === activeCategory);

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">School Calendar</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay updated with important dates, events, and activities throughout the academic year.
        </p>
      </section>

      {/* Calendar View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    activeCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                  } transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Events List */}
            <div className="space-y-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  {/* Date Column */}
                  <div className="flex-shrink-0 text-center md:w-48">
                    <div className="inline-block bg-white rounded-lg shadow px-4 py-3">
                      <CalendarIcon className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-gray-900">
                        {event.date}
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-600">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 flex items-center">
                    <button className="btn-secondary whitespace-nowrap">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Calendar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Download Academic Calendar</h2>
          <p className="mb-6">
            Get the complete academic calendar for the year 2023-24
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Download PDF
          </button>
        </div>
      </section>
    </div>
  );
};

export default Calendar;