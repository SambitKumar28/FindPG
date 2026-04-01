import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const navLinkClass = ({ isActive }) =>
    `relative font-medium transition duration-300 ${
      isActive
        ? "text-cyan-600"
        : "text-gray-700 hover:text-cyan-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div>
              <h1 className="text-2xl font-extrabold bg-linear-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                FindPG
              </h1>
              <p className="text-[11px] text-gray-500 -mt-1">
                Find Your Perfect Stay
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Home
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.75 rounded-full bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/visitpg" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Visit PG
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.75 rounded-full bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  About
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.75 rounded-full bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Contact Us
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.75 rounded-full bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-cyan-600 font-semibold border border-cyan-600 rounded-xl hover:bg-cyan-50 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="px-5 py-6 flex flex-col gap-5">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-medium ${
                  isActive
                    ? "text-cyan-600"
                    : "text-gray-700 hover:text-cyan-600"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/visitpg"
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-medium ${
                  isActive
                    ? "text-cyan-600"
                    : "text-gray-700 hover:text-cyan-600"
                }`
              }
            >
              Visit PG
            </NavLink>

            <NavLink
              to="/about"
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-medium ${
                  isActive
                    ? "text-cyan-600"
                    : "text-gray-700 hover:text-cyan-600"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              onClick={closeMenu}
              className={({ isActive }) =>
                `font-medium ${
                  isActive
                    ? "text-cyan-600"
                    : "text-gray-700 hover:text-cyan-600"
                }`
              }
            >
              Contact
            </NavLink>

            <div className="flex flex-col gap-3 pt-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full text-center px-4 py-3 border border-cyan-600 text-cyan-600 rounded-xl font-semibold hover:bg-cyan-50 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="w-full text-center px-4 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;