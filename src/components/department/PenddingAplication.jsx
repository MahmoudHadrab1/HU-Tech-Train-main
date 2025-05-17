/* eslint-disable no-unused-vars */
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
  Upload,
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  Calendar,
  Award,
  FileCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const PendingApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [uploadedFiles, setUploadedFiles] = useState({});

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

  const toggleExpanded = (appId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedCards(newExpanded);
  };

  const handleFileChange = (appId, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [appId]: file
    }));
  };

  const handleFileUpload = async (e, appId) => {
    e.preventDefault();
    const file = uploadedFiles[appId];
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select a file before uploading.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const formData = new FormData();
    formData.append("officialDocument", file);
    setUploadingId(appId);

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

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Document Uploaded Successfully",
          text: "Student status has been updated to IN_TRAINING",
          confirmButtonColor: "#16a34a",
          showClass: {
            popup: 'animate__animated animate__fadeInUp'
          }
        });

        // Remove the application from the list since it's no longer pending
        setApplications(prev => prev.filter(app => app._id !== appId));
        
        // Clear the uploaded file
        setUploadedFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[appId];
          return newFiles;
        });
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message,
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setUploadingId(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const expandVariants = {
    hidden: { 
      height: 0, 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
          }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
        </motion.div>
        <motion.p 
          className="text-lg font-medium text-gray-700 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading pending applications...
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-64 text-red-500"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <AlertCircle className="w-12 h-12 mb-4" />
        </motion.div>
        <p className="text-lg font-medium">{error}</p>
        <motion.button
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto p-6 my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl mr-4"
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)"
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Clock className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Pending Applications
              </h1>
              <p className="text-gray-500 mt-1">
                Review and approve student applications
              </p>
            </div>
          </div>
          <motion.div 
            className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <span className="text-blue-700 font-semibold">
              {applications.length} Pending
            </span>
          </motion.div>
        </div>
      </motion.div>

      {applications.length === 0 ? (
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Pending Applications
          </h3>
          <p className="text-gray-500">
            All applications have been processed. New applications will appear here.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {applications.map((app, index) => (
            <motion.div
              key={app._id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              layout
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                  {/* Student Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center">
                      <motion.div 
                        className="bg-blue-100 p-2 rounded-full mr-3"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <User className="w-5 h-5 text-blue-600" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {app.student.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {app.student.studentId}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="w-4 h-4 text-purple-500 mr-2" />
                        <span className="font-medium">
                          {app.student.department}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 text-green-500 mr-2" />
                        <span>{app.trainingPost.title}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 text-blue-500 mr-2" />
                        <span>{app.trainingPost.company.name}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500 mr-2" />
                        <span>{app.trainingPost.company.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end space-y-4">
                    <motion.span 
                      className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold flex items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {app.status}
                    </motion.span>

                    <div className="flex gap-2">
                      <motion.a
                        href={`https://railway-system-production-1a43.up.railway.app/${app.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "#2563eb"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View CV
                      </motion.a>

                      <motion.button
                        onClick={() => toggleExpanded(app._id)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                        <motion.div
                          animate={{ 
                            rotate: expandedCards.has(app._id) ? 180 : 0 
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Upload Section */}
              <AnimatePresence>
                {expandedCards.has(app._id) && (
                  <motion.div
                    variants={expandVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl"
                      >
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FileCheck className="w-5 h-5 text-blue-600 mr-2" />
                          Upload Official Training Document
                        </h4>

                        <form
                          onSubmit={(e) => handleFileUpload(e, app._id)}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Official Document
                            </label>
                            <motion.div
                              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                                ${uploadedFiles[app._id] 
                                  ? 'border-green-300 bg-green-50' 
                                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
                                }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                type="file"
                                id={`file-${app._id}`}
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={(e) => handleFileChange(app._id, e.target.files[0])}
                                className="hidden"
                              />
                              <label htmlFor={`file-${app._id}`} className="cursor-pointer">
                                {uploadedFiles[app._id] ? (
                                  <div className="flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                                    <div>
                                      <p className="text-green-700 font-medium">
                                        {uploadedFiles[app._id].name}
                                      </p>
                                      <p className="text-sm text-green-600">
                                        Ready to upload
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">
                                      Click to select file or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                                    </p>
                                  </div>
                                )}
                              </label>
                            </motion.div>
                          </div>

                          <div className="flex justify-end space-x-3">
                            <motion.button
                              type="button"
                              onClick={() => toggleExpanded(app._id)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Cancel
                            </motion.button>

                            <motion.button
                              type="submit"
                              disabled={uploadingId === app._id || !uploadedFiles[app._id]}
                              className={`px-6 py-2 text-white text-sm font-medium rounded-lg transition-all
                                ${uploadingId === app._id || !uploadedFiles[app._id]
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                              whileHover={{ 
                                scale: uploadingId === app._id || !uploadedFiles[app._id] ? 1 : 1.05 
                              }}
                              whileTap={{ 
                                scale: uploadingId === app._id || !uploadedFiles[app._id] ? 1 : 0.95 
                              }}
                            >
                              {uploadingId === app._id ? (
                                <div className="flex items-center">
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <FileCheck className="w-4 h-4 mr-2" />
                                  Upload Document
                                </div>
                              )}
                            </motion.button>
                          </div>
                        </form>

                        <motion.div 
                          className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-700">
                              <p className="font-medium mb-1">Important Note:</p>
                              <p>
                                Once you upload the official document, the student's status will automatically 
                                change to "IN_TRAINING" and their training period will officially begin.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PendingApplication;