import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Briefcase, Lock } from "lucide-react";

const Profile = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    fieldOfWork: "",
    newPassword: "",
    profilePicture: null,
  });

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            title: "Error",
            text: "No token found in local storage.",
            icon: "error",
            confirmButtonColor: "#dc2626",
          });
          return;
        }

        const res = await axios.get(
          "https://railway-system-production-1a43.up.railway.app/api/companies/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCompanyData(res.data.data);
        setForm({
          name: res.data.data.company.name || "",
          phone: res.data.data.company.phone || "",
          location: res.data.data.company.location || "",
          fieldOfWork: res.data.data.company.fieldOfWork || "",
          newPassword: "",
          profilePicture: null,
        });
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || err.message,
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setForm((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "No token found in local storage.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("location", form.location);
    formData.append("fieldOfWork", form.fieldOfWork);
    if (form.newPassword) formData.append("newPassword", form.newPassword);
    if (form.profilePicture)
      formData.append("profilePicture", form.profilePicture);

    try {
      await axios.put(
        "https://railway-system-production-1a43.up.railway.app/api/companies/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Success",
        text: "Profile updated successfully!",
        icon: "success",
        confirmButtonColor: "#dc2626",
      });
    } catch (err) {
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
        <h2 className="text-lg font-semibold text-gray-800 animate-pulse">
          Loading...
        </h2>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
        <h2 className="text-lg font-semibold text-gray-800">No Profile Data</h2>
      </div>
    );
  }

  const { company } = companyData;

  return (
    <div className="max-w-xl my-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
          <Briefcase className="text-red-600" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Company Profile
        </h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={`https://railway-system-production-1a43.up.railway.app/${company.profilePicture}`}
          alt="Profile"
          className="w-40 h-40 rounded-full border border-gray-300 object-cover"
        />
        <div>
          <h3 className="text-lg font-bold text-gray-700">{company.name}</h3>
          <p className="text-sm text-gray-500">{company.fieldOfWork}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {["name", "phone", "location", "fieldOfWork"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          />
        ))}

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Upload Profile Picture
          </label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 file:transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
