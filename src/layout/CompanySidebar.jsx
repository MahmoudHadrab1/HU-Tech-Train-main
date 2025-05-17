import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  FileText,
  LogOut,
  User,
  Home,
  Building,
  CheckCircle,
  Settings,
  FileCheck
} from "lucide-react";

const CompanySidebar = ({ auth, logout, setCurrentView, currentPath }) => {
  useEffect(() => {
    console.log("Auth data in CompanySidebar:", auth);
    if (auth?.user) {
      console.log("User data:", auth.user);
      console.log("Profile data:", auth.user.profile);
    }
  }, [auth]);

  if (!auth || !auth.user) return null;

  const profile = auth.user.profile || {};

  const name = profile.name || auth.user.name || "Company";
  const role = auth.user.role || "company";
  const nationalId = profile.nationalId || auth.user.nationalId || "Unknown";
  const fieldOfWork = profile.fieldOfWork || "Not specified";
  const location = profile.location || "Not specified";

  return (
    <aside className="w-64 bg-white min-h-screen border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-3 flex items-center justify-center">
              {profile.profilePicture ? (
                <img 
                  src={`https://railway-system-production-1a43.up.railway.app/${profile.profilePicture}`} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Building className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-gray-500 capitalize">{role}</p>

            <div className="mt-3 w-full space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-1 text-blue-500" />
                ID: {nationalId}
              </div>
              <div className="flex items-center justify-center">
                <Briefcase className="w-4 h-4 mr-1 text-blue-500" />
                Field: {fieldOfWork}
              </div>
              <div className="flex items-center justify-center">
                <Building className="w-4 h-4 mr-1 text-blue-500" />
                Location: {location}
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/company/posts"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentView("posts")}
          >
            <Briefcase className="w-5 h-5 mr-3" />
            <span>Manage Posts</span>
          </div>
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/company/applications"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentView("applications")}
          >
            <ClipboardList className="w-5 h-5 mr-3" />
            <span>Student Applications</span>
          </div>
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/company/reports"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentView("WeeklyActivityReport")}
          >
            <FileText className="w-5 h-5 mr-3" />
            <span>Activity Reports</span>
          </div>
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/company/final-reports"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentView("CompanyFinalReportModal")}
          >
            <FileCheck className="w-5 h-5 mr-3" />
            <span>Final Reports</span>
          </div>
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/company/profile"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setCurrentView("profile")}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Company Profile</span>
          </div>
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 border-t border-gray-200 p-4">
        {/* Changed from div to Link component to correctly navigate to home page */}
        <Link
          to="/"
          className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <Home className="w-5 h-5 mr-3" />
          <span>Home</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default CompanySidebar;