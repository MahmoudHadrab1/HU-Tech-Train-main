import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import CompanySidebar from "../layout/CompanySidebar";
import Profile from "../components/company/Profile";
import AddPost from "../components/company/AddPost";
import AllRequest from "../components/company/AllRequest";
import WeeklyActivityReport from "../components/company/WeeklyActivityReport";
import CompanyFinalReport from "../components/company/CompanyFinalReportModal";

const CompanyDashBoard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('profile');

  useEffect(() => {
    if (!auth || auth.user?.role !== 'company') {
      navigate("/login/company");
    }
  }, [auth, navigate]);

  const currentPath = `/dashboard/company/${currentView}`;

  if (!auth) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CompanySidebar
        auth={auth}
        logout={logout}
        setCurrentView={setCurrentView} // ✅ هنا التغيير
        currentPath={currentPath}
      />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {currentView === 'profile' && <Profile />}
          {currentView === 'posts' && <AddPost />}
          {currentView === 'applications' && <AllRequest />}
          {currentView === 'WeeklyActivityReport' && <WeeklyActivityReport />}
          {currentView === 'CompanyFinalReportModal' && <CompanyFinalReport />}
        </div>
      </main>
    </div>
  );
};

export default CompanyDashBoard;
