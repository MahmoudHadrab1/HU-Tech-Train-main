import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Pencil, Clock, MapPin, CalendarDays, FileText } from "lucide-react";

const AddPost = () => {
  const [form, setForm] = useState({
    title: "",
    duration: "",
    location: "",
    availableUntil: "",
    description: "",
  });

  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
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
        text: editId ? "Post updated successfully!" : "Training post added!",
        icon: "success",
        confirmButtonColor: "#dc2626",
      });

      setForm({
        title: "",
        duration: "",
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
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      duration: post.duration,
      location: post.location,
      availableUntil: post.availableUntil.split("T")[0],
      description: post.description,
    });
    setEditId(post._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the post.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
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
          text: "The post has been deleted.",
          icon: "success",
          confirmButtonColor: "#dc2626",
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

  return (
    <div className="max-w-md my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-2 bg-red-100 rounded-full mb-4">
          <Pencil className="text-red-600" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {editId ? "Edit Training Post" : "Add Training Post"}
        </h1>
      </div>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Training Title"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <input
          type="number"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (in months)"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="relative">
          <CalendarDays className="absolute left-3 top-3 text-gray-500" />
          <input
            type="date"
            name="availableUntil"
            value={form.availableUntil}
            onChange={handleChange}
            required
            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="relative">
          <FileText className="absolute left-3 top-3 text-gray-500" />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            rows="4"
            className="pl-10 pt-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white w-full px-4 py-3 rounded-md transition-colors"
        >
          {editId ? "Update Post" : "Submit Training Post"}
        </button>
      </form>

      {/* Posts List */}
      {posts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Your Training Posts
          </h2>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-red-600">
                  {post.title}
                </h3>

                <p className="flex items-center text-gray-700 mt-2">
                  <Clock className="w-4 h-4 mr-2 text-red-500" />
                  Duration: {post.duration} month(s)
                </p>

                <p className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  Location: {post.location}
                </p>

                <p className="flex items-center text-gray-700">
                  <CalendarDays className="w-4 h-4 mr-2 text-red-500" />
                  Available Until:{" "}
                  {new Date(post.availableUntil).toDateString()}
                </p>

                <p className="flex items-start text-gray-700 mt-2">
                  <FileText className="w-4 h-4 mr-2 text-red-500 mt-1" />
                  <span>{post.description}</span>
                </p>

                <button
                  onClick={() => handleEdit(post)}
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="mt-2 text-sm text-red-500 hover:underline ml-4"
                >
                  Delete Post
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;
