import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  User,
  Briefcase,
  Loader2,
  AlertCircle,
  MapPin,
  Building,
  GraduationCap,
} from "lucide-react";

const PendingApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://railway-system-production-1a43.up.railway.app/api/department-heads/applications/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setApplications(data.data.applications);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch applications.");
        setLoading(false);
      }
    };

    fetchPendingApplications();
  }, []);

  const handleFileUpload = async (e, appId) => {
    e.preventDefault();
    const formData = new FormData();
    const file = e.target.elements[`file-${appId}`].files[0];
    if (!file) return alert("Please select a file.");

    formData.append("officialDocument", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://railway-system-production-1a43.up.railway.app/api/department-heads/applications/${appId}/document`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        alert("Document uploaded successfully.");
        // Optionally, refresh the applications list after upload
        // fetchPendingApplications();
      } else {
        alert("Failed to upload document.");
      }
    } catch (err) {
      alert("Error uploading the document.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Loading pending applications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-10 h-10 mb-4" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 my-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-8 pb-4 border-b border-gray-100">
        <Clock className="w-6 h-6 text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">
          Pending Applications
        </h1>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-lg">No pending applications found.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {applications.map((app) => (
            <li
              key={app._id}
              className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-200 bg-blue-50"
            >
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {app.student.name}
                    </h3>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium">
                      {app.student.department}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium">Position: </span>
                    <span className="ml-1">{app.trainingPost.title}</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center text-gray-700">
                    <Building className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium">Company: </span>
                    <span className="ml-1">
                      {app.trainingPost.company.name}
                    </span>
                  </div>

                  <div className="flex items-start text-gray-700">
                    <MapPin className="w-4 h-4 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Location: </span>
                      <span>{app.trainingPost.company.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 text-amber-500 mr-2" />
                    <span className="font-medium">Status: </span>
                    <span className="ml-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200 flex justify-end">
                <a
                  href={`https://railway-system-production-1a43.up.railway.app/${app.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View CV
                </a>
              </div>

              {/* File upload form */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <form
                  onSubmit={(e) => handleFileUpload(e, app._id)}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="file"
                      name={`file-${app._id}`}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      className="block w-full text-sm text-gray-600"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      Upload Official Document
                    </button>
                  </div>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingApplication;
