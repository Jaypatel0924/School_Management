import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  GraduationCap,
  LogIn,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import schoolLogo from "../images/school_logo.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userRole, currentUser, logout } = useAuth();

  const rawNavigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Admissions", href: "/admissions" },
    { name: "Results", href: "/results" },
    { name: "Faculty", href: "/faculty" },
    { name: "Gallery", href: "/gallery" },
    { name: "Resources", href: "/resources" },
    { name: "Calendar", href: "/calendar" },
    { name: "Fees", href: "/fees" },
    { name: "Contact", href: "/contact" },
  ];

  const navigation = rawNavigation.filter((item) => {
    if (
      userRole === "admin" &&
      (item.name === "Fees" || item.name === "Resources")
    ) {
      return false;
    }
    if (userRole === "teacher" && item.name === "Fees") {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (currentUser) return currentUser.name;
    switch (userRole) {
      case "admin":
        return "Admin";
      case "teacher":
        return "Teacher";
      case "student":
        return "Student";
      default:
        return "User";
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white ${
        isScrolled ? "shadow-md" : "shadow-sm"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* School Name/Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {/* School Logo */}
              <img
                src={schoolLogo}
                alt="School Logo"
                className="h-12 w-12 mr-2 object-contain" // Slightly larger logo
              />

              {/* School Name - Now with line breaks */}
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-gray-900">
                  Panchjanya Sikshan
                </span>
                <span className="text-lg font-bold text-gray-900">Sankul</span>
              </div>
            </Link>
          </div>
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-4">
            {" "}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={
                  item.name === "Resources" && !isLoggedIn
                    ? "/login"
                    : item.href
                }
                onClick={() => {
                  if (item.name === "Resources" && !isLoggedIn) {
                    setIsUserMenuOpen(false);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none rounded-md hover:bg-indigo-50"
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="truncate max-w-24">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300 ml-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            {isLoggedIn && (
              <Link to="/dashboard" className="mr-2">
                <UserCircle className="h-6 w-6 text-indigo-600" />
              </Link>
            )}
            {!isLoggedIn && (
              <Link
                to="/login"
                className="mr-2 flex items-center space-x-1 px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Panchjanya Sikshan Sankul
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={
                      item.name === "Resources" && !isLoggedIn
                        ? "/login"
                        : item.href
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-center px-3 py-3 rounded-md text-base font-medium ${
                      location.pathname === item.href
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-2 py-2">
                    <UserCircle className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {getUserDisplayName()}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block w-full px-3 py-2 text-base font-medium text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-base font-medium text-center text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 px-3 py-2 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
