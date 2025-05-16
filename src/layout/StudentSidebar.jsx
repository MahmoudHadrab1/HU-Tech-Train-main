// src/layout/Sidebar.jsx
import React, { useEffect } from "react";
import {
  Briefcase,
  ClipboardList,
  FileText,
  LogOut,
  User,
  Home,
  BookOpen,
  GitBranch,
  CheckCircle
} from "lucide-react";

const Sidebar = ({ auth, logout, navigate, currentPath }) => {
  // Debug: Log auth data when it changes
  useEffect(() => {
    console.log("Auth data in Sidebar:", auth);
    if (auth?.user) {
      console.log("User data:", auth.user);
      console.log("Profile data:", auth.user.profile);
    }
  }, [auth]);

  if (!auth || !auth.user) {
    console.log("Auth or user not available");
    return null;
  }

  // Extract user information
  const profile = auth.user.profile || {}; 
  
  console.log("Profile object:", profile);
  
  const name = profile.name || "User";
  const role = auth.user.role || "student";
  const studentId = auth.user.studentId || profile.studentId || "Unknown";
  const department = profile.department || "Not specified";
  const trainingStatus = profile.trainingStatus || "PENDING";
  
  console.log("Extracted profile values:", {
    name,
    role,
    studentId,
    department,
    trainingStatus
  });

  return (
    <aside className="w-64 bg-white min-h-screen border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mb-3 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-sm text-gray-500 capitalize">{role}</p>

            <div className="mt-3 w-full space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                ID: {studentId}
              </div>
              <div className="flex items-center justify-center">
                <GitBranch className="w-4 h-4 mr-1 text-blue-500" />
                Dept: {department}
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle
                  className={`w-4 h-4 mr-1 ${
                    trainingStatus === "IN_TRAINING"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                />
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    trainingStatus === "IN_TRAINING"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {trainingStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/student/training-posts"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => navigate("/dashboard/student/training-posts")}
          >
            <Briefcase className="w-5 h-5 mr-3" />
            <span>Training Posts</span>
          </div>
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/student/applications"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => navigate("/dashboard/student/applications")}
          >
            <ClipboardList className="w-5 h-5 mr-3" />
            <span>Your Applications</span>
          </div>
          <div
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              currentPath === "/dashboard/student/submit-report"
                ? "bg-red-50 text-red-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => navigate("/dashboard/student/submit-report")}
          >
            <FileText className="w-5 h-5 mr-3" />
            <span>Submit Report</span>
          </div>
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 border-t border-gray-200 p-4">
        <div
          className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        >
          <Home className="w-5 h-5 mr-3" />
          <span>Home</span>
        </div>
        <div
          className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;