// src/pages/StudentDashBoard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import Sidebar from "../layout/Sidebar";
import AllPost from "../components/student/AllPost";
import GetAllApplications from "../components/student/GetAllAprovedAplications";
import TrainingReportStudent from "../components/student/TrainingReportStudent";

const StudentDashBoard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('training-posts');
  
  // Check if user is authenticated
  useEffect(() => {
    if (!auth) {
      navigate("/login/student");
    }
  }, [auth, navigate]);

  // Navigation function for sidebar
  const handleNavigation = (path) => {
    const viewMap = {
      '/dashboard/student/training-posts': 'training-posts',
      '/dashboard/student/applications': 'applications',
      '/dashboard/student/submit-report': 'submit-report'
    };
    setCurrentView(viewMap[path] || 'training-posts');
  };

  // Current path based on view
  const currentPath = `/dashboard/student/${currentView}`;

  if (!auth) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        auth={auth}
        logout={logout}
        navigate={handleNavigation}
        currentPath={currentPath}
      />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {currentView === 'training-posts' && <AllPost />}
          {currentView === 'applications' && <GetAllApplications />}
          {currentView === 'submit-report' && <TrainingReportStudent />}
        </div>
      </main>
    </div>
  );
};

export default StudentDashBoard;