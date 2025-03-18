import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">Modern Academy</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Empowering minds, shaping futures, and building tomorrow's leaders
              today.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/admissions"
                  className="text-gray-400 hover:text-white"
                >
                  Admissions
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="text-gray-400 hover:text-white">
                  Faculty
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-gray-400 hover:text-white"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@modernacademy.edu</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Education Ave, Learning City</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Modern Academy. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;