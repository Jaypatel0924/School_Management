import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
  };

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </section>

      {/* Contact Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Phone className="h-8 w-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">Main: +1 (555) 123-4567</p>
            <p className="text-gray-600">Admissions: +1 (555) 234-5678</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Mail className="h-8 w-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600">info@modernacademy.edu</p>
            <p className="text-gray-600">admissions@modernacademy.edu</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Clock className="h-8 w-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
            <p className="text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM</p>
            <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input type="text" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input type="text" className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input type="email" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input type="text" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea className="input-field" rows={4} required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Location */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Our Location</h2>
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25987368715491!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043435129!5m2!1sen!2s"
                className="w-full h-[300px] rounded-lg"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Modern Academy Campus</h3>
                <p className="text-gray-600">
                  123 Education Avenue<br />
                  Learning City, NY 10001<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;