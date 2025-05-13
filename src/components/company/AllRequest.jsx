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
} from "lucide-react";

const AllRequest = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, newStatus) => {
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
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "UNDER_REVIEW":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Loading applications...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 my-10 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
        <Briefcase className="w-6 h-6 text-red-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">
          Student Applications
        </h2>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-lg">No applications found.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app._id}
              className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="mb-3 sm:mb-0">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-gray-700 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {app.student.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <Briefcase className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="mr-1">Department:</span>
                    <span className="font-medium">
                      {app.student.department}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="mr-1">Duration:</span>
                    <span className="font-medium">
                      {app.trainingPost.duration} months
                    </span>
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Position:</span>{" "}
                    <span className="text-blue-600">
                      {app.trainingPost.title}
                    </span>
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">Status:</span>
                    <div className="flex items-center">
                      {getStatusIcon(app.status)}
                      <span
                        className="ml-1 font-medium"
                        style={{
                          color:
                            app.status.toLowerCase() === "approved"
                              ? "#10b981"
                              : app.status.toLowerCase() === "rejected"
                              ? "#ef4444"
                              : "#3b82f6",
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {app.status.toLowerCase() === "approved" && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <a
                    href={`https://railway-system-production-1a43.up.railway.app/${app.officialDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition duration-150 ease-in-out"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Official Document
                  </a>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <a
                  href={`https://railway-system-production-1a43.up.railway.app/${app.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View CV
                </a>

                {app.status.toLowerCase() === "under_review" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(app._id, "APPROVED")}
                      className="px-4 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(app._id, "REJECTED")}
                      className="px-4 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllRequest;
