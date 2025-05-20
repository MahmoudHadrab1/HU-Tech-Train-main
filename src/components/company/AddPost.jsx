/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  Pencil, 
  Clock, 
  MapPin, 
  CalendarDays, 
  FileText, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  CheckCircle, 
  ChevronDown, 
  X,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddPost = () => {
  const [form, setForm] = useState({
    title: "",
    duration: "6", // Default to 6 weeks
    location: "",
    availableUntil: "",
    description: "",
  });

  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const formRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://railway-system-production-1a43.up.railway.app/api/companies/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(res.data.data.posts);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to load your posts. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitting(false);
      return Swal.fire({
        title: "Error",
        text: "No token found in local storage.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }

    const request = editId
      ? axios.put(
          `https://railway-system-production-1a43.up.railway.app/api/training-posts/${editId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      : axios.post(
          "https://railway-system-production-1a43.up.railway.app/api/training-posts",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

    try {
      await request;

      Swal.fire({
        title: "Success",
        text: editId 
          ? "Your training post has been updated successfully!" 
          : "Your new training post has been published!",
        icon: "success",
        confirmButtonColor: "#dc2626",
        showClass: {
          popup: 'animate__animated animate__fadeInUp'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown'
        }
      });

      setForm({
        title: "",
        duration: "6",
        location: "",
        availableUntil: "",
        description: "",
      });
      setEditId(null);
      fetchPosts();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      duration: post.duration.toString(),
      location: post.location,
      availableUntil: post.availableUntil.split("T")[0],
      description: post.description,
    });
    setEditId(post._id);
    
    // Scroll to form with animation
    if (formRef.current) {
      window.scrollTo({ top: formRef.current.offsetTop - 20, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This training post will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      showClass: {
        popup: 'animate__animated animate__fadeInUp'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `https://railway-system-production-1a43.up.railway.app/api/training-posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          title: "Deleted!",
          text: "Your training post has been removed.",
          icon: "success",
          confirmButtonColor: "#dc2626",
          showClass: {
            popup: 'animate__animated animate__fadeInUp'
          }
        });

        fetchPosts(); // Refresh posts after deletion
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || err.message,
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  const toggleExpand = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Add/Edit Form Section - INCREASED SIZE */}
        <motion.div 
          className="lg:col-span-5 bg-white rounded-3xl shadow-lg overflow-hidden min-h-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          ref={formRef}
        >
          <div className="p-8">
            {editId ? (
              <motion.div 
                className="mb-8 flex items-center"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Pencil className="text-red-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Edit Training Post</h2>
              </motion.div>
            ) : (
              <motion.div 
                className="mb-8 flex items-center"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <PlusCircle className="text-red-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Add Training Post</h2>
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Training Title */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Position Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Development Internship"
                  required
                  className="w-full p-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Duration Options */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
                <div className="flex gap-4">
                  <motion.div 
                    className={`flex-1 border-2 rounded-xl cursor-pointer transition-all p-4 flex items-center justify-center ${form.duration === "6" ? "bg-red-50 border-red-300 text-red-600" : "bg-white border-gray-200 text-gray-600"}`}
                    whileHover={form.duration !== "6" ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setForm(prev => ({ ...prev, duration: "6" }))}
                  >
                    <Clock size={20} className="mr-2" />
                    <span className="text-lg">6 Weeks</span>
                    {form.duration === "6" && <CheckCircle size={18} className="ml-2 text-red-600" />}
                  </motion.div>
                  
                  <motion.div 
                    className={`flex-1 border-2 rounded-xl cursor-pointer transition-all p-4 flex items-center justify-center ${form.duration === "8" ? "bg-red-50 border-red-300 text-red-600" : "bg-white border-gray-200 text-gray-600"}`}
                    whileHover={form.duration !== "8" ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setForm(prev => ({ ...prev, duration: "8" }))}
                  >
                    <Clock size={20} className="mr-2" />
                    <span className="text-lg">8 Weeks</span>
                    {form.duration === "8" && <CheckCircle size={18} className="ml-2 text-red-600" />}
                  </motion.div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-700">
                      <strong>Note:</strong> The student training period is <strong>8 weeks</strong> during 
                      regular semesters and <strong>6 weeks</strong> during the summer semester.
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Amman, Jordan"
                    required
                    className="pl-12 w-full p-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Available Until */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Available Until</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="availableUntil"
                    value={form.availableUntil}
                    onChange={handleChange}
                    required
                    placeholder="mm/dd/yyyy"
                    className="pl-12 w-full p-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-gray-400" size={20} />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the training position, responsibilities, and requirements..."
                    required
                    rows="5"
                    className="pl-12 pt-4 w-full text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                className={`relative bg-red-600 hover:bg-red-700 text-white w-full px-6 py-4 rounded-xl font-medium transition-all text-lg ${submitting ? "opacity-80 cursor-wait" : ""}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                
              >
               

                <span className="relative z-10 flex items-center justify-center">
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editId ? "Updating..." : "Publishing..."}
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2" size={20} />
                      {editId ? "Update Training Post" : "Publish Training Post"}
                    </>
                  )}
                </span>
              </motion.button>

              {editId && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setForm({
                      title: "",
                      duration: "6",
                      location: "",
                      availableUntil: "",
                      description: "",
                    });
                    setEditId(null);
                  }}
                  className="w-full text-gray-500 text-base hover:text-gray-700 mt-2 py-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Cancel editing
                </motion.button>
              )}
            </motion.form>
          </div>
        </motion.div>

        {/* Posts List Section - INCREASED SIZE */}
        <motion.div 
          className="lg:col-span-7 bg-white rounded-3xl shadow-lg overflow-hidden min-h-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-8">
            <div className="border-b border-gray-200 pb-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Published Training Posts</h2>
              <p className="text-gray-500 text-lg">
                {posts.length} {posts.length === 1 ? 'position' : 'positions'} currently available for students
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="rounded-full h-16 w-16 border-4 border-gray-200 border-t-4 border-t-red-600"></div>
                </motion.div>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-xl font-medium text-gray-700 mb-2">No training posts yet</p>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                  Create your first training post using the form to start receiving applications from students
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    className="border-2 border-gray-200 rounded-2xl overflow-hidden transition-all hover:shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    layout
                  >
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleExpand(post._id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {post.title}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedPostId === post._id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown
                            size={24}
                            className="text-gray-400"
                          />
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="flex items-center text-gray-700">
                          <div className="bg-red-50 p-2 rounded-full mr-3">
                            <Clock className="w-5 h-5 text-red-500" />
                          </div>
                          <span className="text-base">{post.duration} Weeks Training</span>
                        </div>

                        <div className="flex items-center text-gray-700">
                          <div className="bg-blue-50 p-2 rounded-full mr-3">
                            <MapPin className="w-5 h-5 text-blue-500" />
                          </div>
                          <span className="truncate text-base">{post.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700 mt-2">
                        <div className="bg-green-50 p-2 rounded-full mr-3">
                          <CalendarDays className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-base">
                          Applications close:{" "}
                          <span className="font-medium">
                            {new Date(post.availableUntil).toLocaleDateString()}
                          </span>
                        </span>
                      </div>

                      <AnimatePresence>
                        {expandedPostId === post._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                <h4 className="font-medium text-gray-800 mb-3">Position Description</h4>
                                <p className="text-gray-700 whitespace-pre-line">
                                  {post.description}
                                </p>
                              </div>

                              <div className="flex gap-4">
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(post);
                                  }}
                                  className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-base font-medium"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Edit3 className="w-5 h-5" />
                                  <span>Edit Post</span>
                                </motion.button>
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(post._id);
                                  }}
                                  className="flex items-center justify-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors text-base font-medium"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Trash2 className="w-5 h-5" />
                                  <span>Delete Post</span>
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddPost;