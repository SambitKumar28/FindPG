import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, logout } = useAuth();

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
          <Link to="/" className="flex items-center gap-2">
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
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/visitpg" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Visit PG
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  About
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              {({ isActive }) => (
                <span className="relative">
                  Contact
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-600"></span>
                  )}
                </span>
              )}
            </NavLink>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
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
              </>
            ) : (
              <div className="relative">
                
                {/* User Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border p-2 z-50">
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    {user.role === "owner" && (
                      <Link
                        to="/owner/dashboard"
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Owner Dashboard
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-500 rounded-lg hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-5 py-6 flex flex-col gap-5">
            
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/visitpg" onClick={closeMenu}>Visit PG</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

            <div className="flex flex-col gap-3 pt-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="w-full text-center px-4 py-3 border border-cyan-600 text-cyan-600 rounded-xl font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="w-full text-center px-4 py-3 bg-cyan-600 text-white rounded-xl font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Link to="/profile" onClick={closeMenu}>
                    Profile
                  </Link>

                  {user.role === "owner" && (
                    <Link to="/owner/dashboard" onClick={closeMenu}>
                      Owner Dashboard
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link to="/admin/dashboard" onClick={closeMenu}>
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="text-left text-red-500"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;