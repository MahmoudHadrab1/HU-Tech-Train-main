import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import DepartmentSidebar from "../layout/DepartmentSidebar";
import GetAllStudent from "../components/department/GetAllStudent";
import PenddingAplication from "../components/department/PenddingAplication";

const DepartmentDashBoard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('students');

  useEffect(() => {
    if (!auth || auth.user?.role !== 'department-head') {
      navigate("/login/department-head");
    }
  }, [auth, navigate]);

  const currentPath = `/dashboard/department/${currentView}`;

  if (!auth) return null;

  // Render different components based on currentView
  const renderContent = () => {
    switch(currentView) {
      case 'students':
        return <GetAllStudent />;
      case 'applications':
        return <PenddingAplication />;
      default:
        return <GetAllStudent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DepartmentSidebar
        auth={auth}
        logout={logout}
        setCurrentView={setCurrentView}
        currentPath={currentPath}
      />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DepartmentDashBoard;