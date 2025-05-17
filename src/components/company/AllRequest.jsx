/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Clock,
  User,
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Bookmark,
  ChevronDown,
  FileCheck,
  Clipboard,
  Star,
  Award,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const AllRequest = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://railway-system-production-1a43.up.railway.app/api/companies/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(response.data.data.applications);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch applications. Please try again.",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, newStatus) => {
    setProcessingId(applicationId);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://railway-system-production-1a43.up.railway.app/api/companies/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Application status has been updated to ${newStatus}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update application status.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "under_review":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    const statusMap = {
      under_review: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Under Review"
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved"
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rejected"
      }
    };

    const statusInfo = statusMap[statusLower] || statusMap.under_review;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
        {getStatusIcon(status)}
        <span className="ml-1.5">{statusInfo.label}</span>
      </span>
    );
  };

  const toggleExpand = (id) => {
    setExpandedApp(expandedApp === id ? null : id);
  };

 
  

  // Filter applications based on status and selection
  const filteredApplications = applications.filter(app => {
    if (filterStatus === "selected") {
      return app.selectedByStudent === true;
    } else if (filterStatus === "all") {
      return true;
    } else {
      return app.status.toLowerCase() === filterStatus.toLowerCase();
    }
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin">
          <Loader2 className="w-12 h-12 text-red-600 mb-4" />
        </div>
        <p className="text-lg font-medium text-gray-700">
          Loading applications...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 my-10 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <Briefcase className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Student Applications
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterStatus("all")} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filterStatus === "all" 
                ? "bg-red-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterStatus("under_review")} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filterStatus === "under_review" 
                ? "bg-yellow-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilterStatus("approved")} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filterStatus === "approved" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Approved
          </button>
          <button 
            onClick={() => setFilterStatus("rejected")} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filterStatus === "rejected" 
                ? "bg-red-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Rejected
          </button>
          <button 
            onClick={() => setFilterStatus("selected")} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filterStatus === "selected" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Star className="w-4 h-4 inline mr-1" />
            Selected
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl font-medium">No applications found.</p>
          <p className="text-gray-400 mt-2">Applications from students will appear here.</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl font-medium">
            No {filterStatus === "selected" ? "selected" : filterStatus} applications found.
          </p>
          <button 
            onClick={() => setFilterStatus("all")} 
            className="mt-4 text-red-600 font-medium hover:text-red-700 hover:underline"
          >
            View all applications
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <div 
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(app._id)}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 rounded-full p-2.5 flex-shrink-0 mt-1">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        {app.student.name}
                        {app.selectedByStudent && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2 text-yellow-500"
                          >
                            <Star className="w-5 h-5 inline" fill="currentColor" />
                          </motion.span>
                        )}
                        <motion.span 
                          animate={{ rotate: expandedApp === app._id ? 180 : 0 }}
                          className="ml-2"
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.span>
                      </h3>
                      <div className="text-sm text-gray-600 mt-1 flex items-center">
                        <Bookmark className="w-4 h-4 text-gray-500 mr-1.5" />
                        <span className="font-medium">{app.student.department}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {app.trainingPost.title}
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {expandedApp === app._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-4 border-t border-gray-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Clock className="w-4 h-4 text-gray-500 mt-1 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Duration</p>
                            <p className="text-gray-600">{app.trainingPost.duration} months</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="w-4 h-4 text-gray-500 mt-1 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Application Date</p>
                            <p className="text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {app.selectedByStudent && (
                          <div className="flex items-start">
                            <Star className="w-4 h-4 text-yellow-500 mt-1 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Selection Status</p>
                              <p className="text-green-600 font-medium">Selected by student for internship</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2">Application Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={`https://railway-system-production-1a43.up.railway.app/${app.cv}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View CV
                            </a>
                            
                            {app.status.toLowerCase() === "approved" && app.officialDocument && (
                              <a
                                href={`https://railway-system-production-1a43.up.railway.app/${app.officialDocument}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                              >
                                <FileCheck className="w-4 h-4 mr-2" />
                                Official Document
                              </a>
                            )}
                            
                          
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Activity Reports Section */}
                    {app.activityReports && app.activityReports.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                      >
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Clipboard className="w-5 h-5 text-blue-600 mr-2" /> 
                          Activity Reports ({app.activityReports.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {app.activityReports.map((report, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 + (index * 0.1) }}
                              className="relative group"
                            >
                              <a
                                href={`https://railway-system-production-1a43.up.railway.app/${report}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                }}
                                className="w-full p-4 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors text-left flex items-center"
                              >
                                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="overflow-hidden">
                                  <div className="text-sm font-bold truncate mb-1">
                                    Activity Report #{index + 1}
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Status Update Section for UNDER_REVIEW applications */}
                    {app.status.toLowerCase() === "under_review" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                      >
                        <h4 className="font-medium text-gray-800 mb-3">Update Application Status</h4>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(app._id, "APPROVED");
                            }}
                            disabled={processingId === app._id}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === app._id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve Application
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(app._id, "REJECTED");
                            }}
                            disabled={processingId === app._id}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === app._id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Application
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRequest;