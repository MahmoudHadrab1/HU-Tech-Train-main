/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  FileText,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  Calendar,
  Building,
  Filter,
  Search,
  ChevronDown,
  X,
  Sparkles,
  CheckSquare,
  Square
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

// Status color mappings
const STATUS_COLORS = {
  "UNDER_REVIEW": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "text-yellow-500", gradient: "from-yellow-500 to-amber-500" },
  "APPROVED": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "text-green-500", gradient: "from-green-500 to-emerald-500" },
  "REJECTED": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-500", gradient: "from-red-500 to-rose-500" },
  "SELECTED": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-500", gradient: "from-blue-500 to-indigo-500" },
};

// Get appropriate colors based on status
const getStatusColors = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS["UNDER_REVIEW"];
};

// Display name mapping for statuses
const STATUS_DISPLAY = {
  "UNDER_REVIEW": "Pending",
  "APPROVED": "Approved",
  "REJECTED": "Rejected",
  "SELECTED": "Selected"
};

// Filter mapping (reverse of the display mapping)
const FILTER_STATUS_MAP = {
  "pending": "UNDER_REVIEW",
  "approved": "APPROVED",
  "rejected": "REJECTED",
   "selected": "SELECTED"
};

// Application Card Component
const ApplicationCard = ({ application, onSelect, selectingId }) => {
  const [expanded, setExpanded] = useState(false);
  const { trainingPost, status, _id, cv } = application;
  const statusColors = getStatusColors(status);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div 
      className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      layout
      whileHover={{ 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", 
        borderColor: "#e5e7eb"
      }}
    >
      {/* Top section - always visible */}
      <div onClick={toggleExpand} className="p-5 cursor-pointer relative">
        {/* Accent border at top of card */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusColors.gradient}`}
        ></div>
        
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2 group">
              <span className="group-hover:text-blue-600 transition-colors duration-300">
                {trainingPost.title}
              </span>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                  {status === "SELECTED" && <Sparkles size={10} className="mr-1" />}
                  {STATUS_DISPLAY[status] || status}
                </span>
              </motion.div>
            </h3>
            
            <div className="flex items-center text-gray-600">
              <Building className="w-4 h-4 mr-1.5 text-gray-500" />
              <span className="font-medium">{trainingPost.company.name}</span>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <motion.div 
            className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{trainingPost.location}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Clock className="w-4 h-4 mr-2 text-green-500" />
            <span>{trainingPost.duration} weeks</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Calendar className="w-4 h-4 mr-2 text-red-500" />
            <span>Applied on {new Date(application.createdAt).toLocaleDateString()}</span>
          </motion.div>
        </div>
      </div>
      
      {/* Expanded section - only includes View CV and Select button */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 border-t border-gray-100">
              <motion.div
                className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Application Options
                </h4>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.a
                    href={`https://railway-system-production-1a43.up.railway.app/${cv}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FileText className="w-4 h-4 mr-1.5" />
                    View CV
                  </motion.a>

                  {status === "APPROVED" ? (
               <motion.button
               onClick={(e) => {
               e.stopPropagation();
              onSelect(_id);
              }}
    disabled={selectingId === _id}
    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-70"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    {selectingId === _id ? (
      <>
        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
        Selecting...
      </>
    ) : (
      <>
        <CheckCircle className="w-4 h-4 mr-1.5" />
        Select This Position
      </>
    )}
  </motion.button>
) : status === "SELECTED" ? (
  <div className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
    <CheckCircle className="w-4 h-4 mr-1.5" />
    Position Selected
  </div>
) : null}

                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Filter component with multi-status selection
const ApplicationsFilter = ({ filters, setFilters, totalCount }) => {
  const { status, search } = filters;
  const ALL_STATUSES = ["pending", "approved", "rejected", "selected"];
  
  // Check if a status is selected
  const isStatusSelected = (statusKey) => {
    return status.includes(statusKey);
  };
  
  // Handle individual status toggling
  const handleStatusChange = (statusKey) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(statusKey)
        ? prev.status.filter(s => s !== statusKey)
        : [...prev.status, statusKey]
    }));
  };

  // // Handle "Select All" functionality
  // const selectAllStatuses = () => {
  //   setFilters(prev => ({
  //     ...prev,
  //     status: [...ALL_STATUSES]
  //   }));
  // };

  // // Handle "Clear All" functionality
  // const clearAllStatuses = () => {
  //   setFilters(prev => ({
  //     ...prev,
  //     status: []
  //   }));
  // };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      search: ""
    });
  };
  
  const hasActiveFilters = status.length > 0 || search;
  const allSelected = ALL_STATUSES.every(s => status.includes(s));
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          {search && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Status filter section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Filter by status</h3>
          <div className="flex gap-2">
            {/* <button
              onClick={selectAllStatuses}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <span className="text-gray-300">|</span> */}
            {/* <button
            //  onClick={clearAllStatuses}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button> */}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusChange("pending")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1.5 ${
              isStatusSelected("pending") 
                ? "bg-yellow-50 text-yellow-700 border-yellow-200" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {isStatusSelected("pending") ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Pending
          </button>
          
          <button
            onClick={() => handleStatusChange("approved")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1.5 ${
              isStatusSelected("approved") 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {isStatusSelected("approved") ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Approved
          </button>
          
          <button
            onClick={() => handleStatusChange("rejected")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1.5 ${
              isStatusSelected("rejected") 
                ? "bg-red-50 text-red-700 border-red-200" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {isStatusSelected("rejected") ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Rejected
          </button>
          
          {/* <button
            onClick={() => handleStatusChange("selected")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1.5 ${
              isStatusSelected("selected") 
                ? "bg-blue-50 text-blue-700 border-blue-200" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {isStatusSelected("selected") ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Selected
          </button> */}
        </div>
      </div>
      
      {/* Active filters area */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-1.5" />
              <span>Filtered by:</span>
            </div>
            
            {status.map(statusKey => (
              <span 
                key={statusKey}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[FILTER_STATUS_MAP[statusKey]].bg} ${STATUS_COLORS[FILTER_STATUS_MAP[statusKey]].text}`}
              >
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleStatusChange(statusKey)}
                />
              </span>
            ))}
            
            {search && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                "{search}"
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => setFilters(prev => ({ ...prev, search: "" }))}
                />
              </span>
            )}
          </div>
          
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

// Main component
const GetAllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectingId, setSelectingId] = useState(null);
  const [filters, setFilters] = useState({
    status: [],  // Changed from string to array to support multiple selection
    search: ""
  });
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const containerRef = useRef(null);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
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
        setError(null);
        
        // Set first load to false after a delay for animations
        setTimeout(() => setIsFirstLoad(false), 300);
      } catch (error) {
        console.error("Error fetching student applications:", error);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Handle selecting an application
  const handleSelect = useCallback(async (id) => {
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
      
      // Update the local state to reflect selection
      setApplications(prevApps => 
        prevApps.map(app => 
          app._id === id 
            ? { ...app, status: "SELECTED" } 
            : app.status === "SELECTED" 
              ? { ...app, status: "APPROVED" } // Revert any previously selected application
              : app
        )
      );
      
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Position Selected!",
        text: "You have successfully selected this training position.",
        confirmButtonColor: "#16a34a",
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      });
      
    } catch (error) {
      console.error("Error selecting application:", error);
      
      // Show error message
      Swal.fire({
        icon: "error",
        title: "Selection Failed",
        text: "You can only have one selected position at a time.",
        confirmButtonColor: "#dc2626",
      });
      
    } finally {
      setSelectingId(null);
    }
  }, []);

  // Filter applications based on multi-select filters
  const filteredApplications = applications.filter(app => {
    const { status, search } = filters;
    
    // Multi-status filter logic
    const matchesStatus = status.length === 0 || status.some(statusKey => {
      const apiStatus = FILTER_STATUS_MAP[statusKey];
      return app.status === apiStatus;
    });
      
    const matchesSearch = search
      ? app.trainingPost.title.toLowerCase().includes(search.toLowerCase()) ||
        app.trainingPost.company.name.toLowerCase().includes(search.toLowerCase()) ||
        (app.trainingPost.location && app.trainingPost.location.toLowerCase().includes(search.toLowerCase()))
      : true;
      
    return matchesStatus && matchesSearch;
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <motion.div 
          className="relative w-24 h-24"
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-t-green-500 border-r-green-500 rounded-full"></div>
          <motion.div 
            className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <Briefcase className="w-8 h-8 text-green-600" />
          </motion.div>
        </motion.div>
        <motion.p 
          className="text-lg font-medium text-gray-700 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading your applications...
        </motion.p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-xl shadow-md border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <motion.div 
            className="bg-red-100 p-3 rounded-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          >
            <AlertCircle className="w-8 h-8 text-red-600" />
          </motion.div>
          <motion.p 
            className="text-lg font-medium mt-4 text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {error}
          </motion.p>
          <motion.button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-xl shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <motion.div 
        className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center">
          <motion.div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg mr-3 shadow-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage your training position applications</p>
          </div>
        </div>
        
        <motion.div 
          className="text-sm text-gray-500 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          Total: {applications.length}
        </motion.div>
      </motion.div>

      {/* Enhanced Filters */}
      <ApplicationsFilter 
        filters={filters} 
        setFilters={setFilters} 
        totalCount={applications.length} 
      />

      {/* Applications list */}
      {applications.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="bg-gray-100 p-4 rounded-full mb-4"
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 15px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </motion.div>
          <motion.p 
            className="text-lg font-medium text-gray-700 mb-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            No applications found
          </motion.p>
          <motion.p 
            className="text-gray-500 mb-6 text-center max-w-md"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            You haven't applied for any training positions yet. Browse available opportunities to get started.
          </motion.p>
          <motion.a 
            href="/training-posts" 
            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg transition-all shadow-md"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Browse Opportunities
          </motion.a>
        </motion.div>
      ) : filteredApplications.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="bg-gray-100 p-3 rounded-full mb-3"
            whileHover={{ rotate: 15 }}
          >
            <Search className="w-6 h-6 text-gray-400" />
          </motion.div>
          <motion.p 
            className="text-gray-700 font-medium"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            No matching applications found
          </motion.p>
          <motion.p 
            className="text-gray-500 mt-1 mb-3"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Try adjusting your filters
          </motion.p>
          <motion.button
            onClick={() => setFilters({ status: [], search: "" })}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Clear filters
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application, index) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onSelect={handleSelect}
              selectingId={selectingId}
            />
          ))}
        </div>
      )}

      {/* Information section */}
      {applications.length > 0 && (
        <motion.div 
          className="mt-8 pt-6 border-t border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 relative overflow-hidden"
            whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 rounded-full opacity-50"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse", 
              }}
            />
            
            <div className="relative z-10 flex items-start">
              <motion.div 
                className="mr-2 mt-0.5 text-blue-600 flex-shrink-0"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
              
              <div>
                <p className="font-medium">Important information</p>
                <p className="mt-1">
                  After an application is <strong>approved</strong>, you can select it as your final choice. 
                  You can only have one selected position at a time.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GetAllApplications;