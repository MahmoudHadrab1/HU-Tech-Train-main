// src/components/department/DepartmentSidebar.jsx
import React from "react";
import { Home, LogOut, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const DepartmentSidebar = ({ auth, setCurrentView, currentView }) => {
  // Get department head name and department from auth data
  const departmentHeadName = auth?.user?.profile?.name || "Department Head";
  const departmentName = auth?.user?.profile?.department || "Department";
  
  return (
    <div className="w-64 border-r border-gray-200 h-screen bg-white flex flex-col justify-between">
      {/* Department Head Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-800 text-center">
          {departmentHeadName}
        </h2>
        <p className="text-sm text-gray-500 text-center">
          department head of {departmentName}
        </p>
      </div>
      
      {/* Navigation Links */}
      <nav className="mt-2 flex-grow">
        <button
          onClick={() => setCurrentView('students')}
          className={`w-full flex items-center px-6 py-3 ${
            currentView === 'students' 
              ? 'bg-red-50 text-red-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <User className="w-5 h-5 mr-3" />
          <span>All Students</span>
        </button>
        
        <button
          onClick={() => setCurrentView('applications')}
          className={`w-full flex items-center px-6 py-3 ${
            currentView === 'applications' 
              ? 'bg-red-50 text-red-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-5 h-5 mr-3" />
          <span>Pending Applications</span>
        </button>
      </nav>
      
      {/* Bottom actions - styled to match the screenshot */}
      <div className="mt-auto border-t border-gray-100">
        <Link
          to="/"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
        >
          <Home className="w-5 h-5 mr-3 text-gray-500" />
          <span className="text-gray-600">Home</span>
        </Link>
        
        <Link
          to="/login/department-head"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }}
          className="flex items-center px-6 py-3 text-red-600 hover:bg-gray-50"
        >
          <LogOut className="w-5 h-5 mr-3 text-red-600" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default DepartmentSidebar;