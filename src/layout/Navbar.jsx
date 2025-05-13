import React, { useState } from "react";
import {
  Home,
  Info,
  GraduationCap,
  Building2,
  LogIn,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { auth, logout } = useAuth(); // 🔁 Use context

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className="bg-white text-gray-800 shadow-lg border-b-2 border-red-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="text-red-600" size={24} />
            <span className="text-xl font-bold text-red-600">
              HU Tech-Train
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" icon={<Home size={18} />} text="Home" />
            <NavLink to="/about" icon={<Info size={18} />} text="About" />
            <NavLink
              to="/student"
              icon={<GraduationCap size={18} />}
              text="Student"
            />
            <NavLink
              to="/company"
              icon={<Building2 size={18} />}
              text="Company"
            />

            {/* 🔁 Conditional Rendering for Login / User Info */}
            {auth ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 capitalize text-sm">
                  {auth.user.role}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-red-600 focus:outline-none transition duration-150 ease-in-out"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <DropdownItem
                      to="/login/student"
                      text="Student Login"
                      onClose={closeDropdown}
                    />
                    <DropdownItem
                      to="/login/company"
                      text="Company Login"
                      onClose={closeDropdown}
                    />
                    <DropdownItem
                      to="/login/department-head"
                      text="Department Head Login"
                      onClose={closeDropdown}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="text-gray-500 hover:text-red-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 🔁 Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4 space-y-1">
            <MobileNavLink
              to="/"
              icon={<Home size={18} />}
              text="Home"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/about"
              icon={<Info size={18} />}
              text="About"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/student"
              icon={<GraduationCap size={18} />}
              text="Student"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/company"
              icon={<Building2 size={18} />}
              text="Company"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {auth ? (
              <div className="border-t border-gray-200 pt-2 mt-2 px-4">
                <div className="text-gray-600 capitalize text-sm mb-2">
                  Logged in as: {auth.user.role}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-4 py-2 text-gray-500 font-medium">
                  Login Options
                </div>
                <MobileNavLink
                  to="/login/student"
                  text="Student Login"
                  indent
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileNavLink
                  to="/login/company"
                  text="Company Login"
                  indent
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <MobileNavLink
                  to="/login/department-head"
                  text="Department Head Login"
                  indent
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// 🔹 Reusable Link Components
const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:text-red-600 transition duration-150 ease-in-out"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const DropdownItem = ({ to, text, onClose }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-red-600"
    onClick={onClose}
  >
    {text}
  </Link>
);

const MobileNavLink = ({ to, icon, text, indent, onClick }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 ${
      indent ? "pl-8" : ""
    }`}
    onClick={onClick}
  >
    {icon && icon}
    <span>{text}</span>
  </Link>
);
