import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  UploadCloud,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Building,
  Search,
  FileText,
} from "lucide-react";
import Swal from "sweetalert2";

const AllPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cvFiles, setCvFiles] = useState({}); // Track uploaded CVs per post
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://railway-system-production-1a43.up.railway.app/api/students/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleFileChange = (postId, file) => {
    setCvFiles((prev) => ({
      ...prev,
      [postId]: file,
    }));
  };

  const handleApply = async (postId) => {
    const file = cvFiles[postId];
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Missing CV",
        text: "Please upload your CV before applying.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://railway-system-production-1a43.up.railway.app/api/students/posts/${postId}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Applied Successfully",
        text: res.data.message || "Your application was submitted.",
        confirmButtonColor: "#dc2626",
      });

      // Optionally clear file input
      setCvFiles((prev) => ({ ...prev, [postId]: null }));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: error.response?.data?.message || error.message,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const togglePostExpansion = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <div className="text-red-600 font-semibold text-lg">
            Loading opportunities...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-10 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
          <Briefcase className="text-red-600" size={28} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Available Training Opportunities
        </h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Discover and apply for career-advancing training positions from our
          network of approved industry partners
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Search by title, company or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <Briefcase className="mx-auto text-gray-400 mb-3" size={32} />
          <p className="text-gray-500 text-lg">
            No training positions match your search.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-3 text-red-600 hover:text-red-800 font-medium"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Post Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => togglePostExpansion(post._id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Building className="w-4 h-4 mr-1" />
                      <span className="font-medium">{post.company.name}</span>
                      <span className="mx-2">•</span>
                      <Tag className="w-4 h-4 mr-1" />
                      <span>{post.company.fieldOfWork}</span>
                    </div>
                  </div>
                </div>

                {/* Post Meta Info */}
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.duration} months</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Until {new Date(post.availableUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedPost === post._id && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                  <p className="text-gray-700 mb-6">{post.description}</p>

                  {/* Application Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Apply for this position
                    </h4>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-grow">
                        <input
                          type="file"
                          id={`cv-upload-${post._id}`}
                          accept=".pdf"
                          onChange={(e) =>
                            handleFileChange(post._id, e.target.files[0])
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor={`cv-upload-${post._id}`}
                          className={`flex items-center justify-center w-full p-3 border ${
                            cvFiles[post._id]
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 bg-white"
                          } rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`}
                        >
                          <FileText
                            className={`mr-2 h-5 w-5 ${
                              cvFiles[post._id]
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          />
                          <span
                            className={
                              cvFiles[post._id]
                                ? "text-green-600"
                                : "text-gray-700"
                            }
                          >
                            {cvFiles[post._id]
                              ? cvFiles[post._id].name
                              : "Upload your CV (PDF)"}
                          </span>
                        </label>
                      </div>

                      <button
                        onClick={() => handleApply(post._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center sm:w-auto transition-colors"
                      >
                        <UploadCloud className="mr-2 h-5 w-5" />
                        Submit Application
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPost;
