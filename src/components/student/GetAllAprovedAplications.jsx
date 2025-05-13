import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const GetAllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null); // ID of application being selected

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://railway-system-production-1a43.up.railway.app/api/students/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(response.data.data.applications);
      } catch (error) {
        console.error("Error fetching student applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleSelect = async (id) => {
    const token = localStorage.getItem("token");
    setSelectingId(id);
    try {
      await axios.put(
        `https://railway-system-production-1a43.up.railway.app/api/students/applications/${id}/select`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Application selected successfully.");
    } catch (error) {
      console.error("Error selecting application:", error);
      alert("Failed to select application.");
    } finally {
      setSelectingId(null);
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
    <div className="max-w-4xl mx-auto p-6 my-10 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
        <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">All Applications</h2>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-lg">No applications found.</p>
        </div>
      ) : (
        <ul className="space-y-5">
          {applications.map((app) => (
            <li
              key={app._id}
              className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-gray-50"
            >
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Briefcase className="w-5 h-5 text-gray-700 mr-2" />
                  {app.trainingPost.title}
                </h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Company: </span>
                  <span className="font-medium ml-1">
                    {app.trainingPost.company.name}
                  </span>
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  Duration: {app.trainingPost.duration} months
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  Location: {app.trainingPost.location}
                </p>
                <p className="text-sm mt-2 font-medium text-gray-600">
                  Status: {app.status}
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a
                  href={`https://railway-system-production-1a43.up.railway.app/${app.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View CV
                </a>

                {app.status?.toLowerCase() === "approved" && (
                  <button
                    onClick={() => handleSelect(app._id)}
                    disabled={selectingId === app._id}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {selectingId === app._id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Selecting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Select
                      </>
                    )}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetAllApplications;
