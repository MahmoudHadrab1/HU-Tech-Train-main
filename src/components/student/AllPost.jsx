/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  UploadCloud,
  MapPin,
  Calendar,
  Clock,
  Building,
  Search,
  FileText,
  ChevronDown,
  CheckCircle,
  X,
  AlertCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const AllPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cvFiles, setCvFiles] = useState({}); // Track uploaded CVs per post
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  
  // New state to track application status per post
  const [applicationStatus, setApplicationStatus] = useState({}); 
  // applicationStatus structure: { postId: 'applied' | 'rejected' | null }

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
        Swal.fire({
          icon: "error",
          title: "Connection Error",
          text: "Failed to load training opportunities. Please try again later.",
          confirmButtonColor: "#dc2626",
        });
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
    
    // Clear any previous rejection status when a new file is selected
    if (applicationStatus[postId] === 'rejected') {
      setApplicationStatus((prev) => ({
        ...prev,
        [postId]: null,
      }));
    }
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
      setLoading(true);
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

      // On successful submission
      Swal.fire({
        icon: "success",
        title: "Applied Successfully",
        text: res.data.message || "Your application was submitted.",
        confirmButtonColor: "#dc2626",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Mark as applied and clear file input
      setApplicationStatus((prev) => ({
        ...prev,
        [postId]: 'applied',
      }));
      setCvFiles((prev) => ({ ...prev, [postId]: null }));
      
    } catch (error) {
      // On rejection/error
      const errorMessage = error.response?.data?.message || error.message;
      
      // Check if the error is about already applying
      if (errorMessage.toLowerCase().includes("already applied") || 
          errorMessage.toLowerCase().includes("you have already applied")) {
        
        Swal.fire({
          icon: "error",
          title: "Application Failed",
          text: "You have already applied for this training post",
          confirmButtonColor: "#dc2626",
        });

        // Mark as already applied and clear the file
        setApplicationStatus((prev) => ({
          ...prev,
          [postId]: 'already_applied',
        }));
        setCvFiles((prev) => ({ ...prev, [postId]: null }));
        
      } else {
        // For other errors, show the error and mark as rejected
        Swal.fire({
          icon: "error",
          title: "Application Failed",
          text: errorMessage,
          confirmButtonColor: "#dc2626",
        });

        // Mark as rejected - keep the file so user can try again
        setApplicationStatus((prev) => ({
          ...prev,
          [postId]: 'rejected',
        }));
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleRetryApplication = (postId) => {
    // Reset the rejection status so user can try again
    setApplicationStatus((prev) => ({
      ...prev,
      [postId]: null,
    }));
  };

  const togglePostExpansion = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const sortPosts = (posts) => {
    if (sortBy === "latest") {
      return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "duration-asc") {
      return [...posts].sort((a, b) => a.duration - b.duration);
    } else if (sortBy === "duration-desc") {
      return [...posts].sort((a, b) => b.duration - a.duration);
    }
    return posts;
  };

  const filteredPosts = sortPosts(posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Helper function to get application status display
  const getApplicationStatusDisplay = (postId) => {
    const status = applicationStatus[postId];
    
    if (status === 'applied') {
      return (
        <div className="flex items-center text-green-600 text-sm font-medium mt-2">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Application Submitted</span>
        </div>
      );
    } else if (status === 'rejected') {
      return (
        <div className="flex items-center text-red-600 text-sm font-medium mt-2">
          <XCircle className="w-4 h-4 mr-1" />
          <span>Application Rejected</span>
        </div>
      );
    } else if (status === 'already_applied') {
      return (
        <div className="flex items-center text-orange-600 text-sm font-medium mt-2">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>Already Applied</span>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-20 h-20">
            <motion.div 
              className="absolute top-0 left-0 right-0 bottom-0 border-4 border-red-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ borderTopColor: 'transparent' }}
            />
          </div>
          <motion.div 
            className="text-red-600 font-semibold text-lg mt-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading opportunities...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-10 px-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse"
            }}
          >
            <Briefcase className="text-red-600" size={28} />
          </motion.div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Available Training Opportunities
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover and apply for career-advancing training positions from our
          network of approved industry partners
        </p>
      </motion.div>

      {/* Search Bar and Sort */}
      <motion.div 
        className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
              placeholder="Search by title, company or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600"
                onClick={() => setSearchTerm("")}
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex items-center whitespace-nowrap">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="latest">Latest</option>
              <option value="duration-asc">Duration (Low to High)</option>
              <option value="duration-desc">Duration (High to Low)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Summary */}
      <motion.div 
        className="mb-4 text-sm text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Showing {filteredPosts.length} opportunities
      </motion.div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Briefcase className="mx-auto text-gray-400 mb-3" size={40} />
          <p className="text-gray-500 text-lg font-medium mb-2">
            No training positions match your search
          </p>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchTerm("")}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear search
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.1 * (index % 10) // Stagger the animations
              }}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-300"
            >
              {/* Post Header */}
              <div
                className="p-6 cursor-pointer transition-colors duration-300 hover:bg-gray-50"
                onClick={() => togglePostExpansion(post._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 hover:text-red-600 transition-colors">
                        {post.title}
                      </h3>
                      <motion.div
                        animate={{ rotate: expandedPost === post._id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Building className="w-4 h-4 mr-2 text-red-500" />
                      <span className="font-medium">{post.company.name}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-500">{post.company.fieldOfWork}</span>
                    </div>
                  </div>
                </div>

                {/* Post Meta Info */}
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-red-500" />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-blue-500" />
                    <span>{post.duration} weeks</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-green-500" />
                    <span>
                      Until {new Date(post.availableUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Application Status Display */}
                {getApplicationStatusDisplay(post._id)}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedPost === post._id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                      <div className="py-4">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h4>
                        <p className="text-gray-700">{post.description}</p>
                      </div>

                      {/* Application Section */}
                      <motion.div 
                        className="bg-gray-50 p-5 rounded-lg mt-4 border border-gray-200"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <UploadCloud className="w-5 h-5 mr-2 text-red-600" />
                          Apply for this position
                        </h4>

                        {/* Show application status information */}
                        {applicationStatus[post._id] === 'applied' && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center text-green-700">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span className="font-medium">Application submitted successfully!</span>
                            </div>
                            <p className="text-green-600 text-sm mt-1">
                              Your application is being reviewed. You'll be notified of the result.
                            </p>
                          </div>
                        )}

                        {applicationStatus[post._id] === 'already_applied' && (
                          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center text-orange-700">
                              <AlertCircle className="w-5 h-5 mr-2" />
                              <span className="font-medium">You have already applied for this training post</span>
                            </div>
                            <p className="text-orange-600 text-sm mt-1">
                              Check your applications page to track the status of this application.
                            </p>
                          </div>
                        )}

                        {applicationStatus[post._id] === 'rejected' && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-red-700">
                                <XCircle className="w-5 h-5 mr-2" />
                                <span className="font-medium">Application was rejected</span>
                              </div>
                              <button
                                onClick={() => handleRetryApplication(post._id)}
                                className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Try Again
                              </button>
                            </div>
                            <p className="text-red-600 text-sm mt-1">
                              You can upload a new CV and reapply for this position.
                            </p>
                          </div>
                        )}

                        {/* File upload and submit section - only show if not applied or already applied */}
                        {applicationStatus[post._id] !== 'applied' && applicationStatus[post._id] !== 'already_applied' && (
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
                                className={`flex items-center justify-center w-full p-3 border-2 ${
                                  cvFiles[post._id]
                                    ? "border-green-500 bg-green-50"
                                    : applicationStatus[post._id] === 'rejected'
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300 bg-white"
                                } rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300`}
                              >
                                {cvFiles[post._id] ? (
                                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                                ) : applicationStatus[post._id] === 'rejected' ? (
                                  <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                                ) : (
                                  <FileText className="mr-2 h-5 w-5 text-gray-500" />
                                )}
                                <span
                                  className={
                                    cvFiles[post._id]
                                      ? "text-green-600 font-medium"
                                      : applicationStatus[post._id] === 'rejected'
                                      ? "text-red-600"
                                      : "text-gray-700"
                                  }
                                >
                                  {cvFiles[post._id]
                                    ? cvFiles[post._id].name
                                    : applicationStatus[post._id] === 'rejected'
                                    ? "Upload a new CV (PDF)"
                                    : "Upload your CV (PDF)"}
                                </span>
                              </label>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleApply(post._id)}
                              className={`px-6 py-3 rounded-lg flex items-center justify-center sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg ${
                                applicationStatus[post._id] === 'rejected'
                                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                                  : "bg-red-600 hover:bg-red-700 text-white"
                              }`}
                            >
                              <UploadCloud className="mr-2 h-5 w-5" />
                              {applicationStatus[post._id] === 'rejected' 
                                ? "Resubmit Application" 
                                : "Submit Application"}
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPost;