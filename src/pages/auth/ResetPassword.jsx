import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/AuthContext";
import { Lock, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://railway-system-production-1a43.up.railway.app/api/auth/resetpassword/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reset failed");
      }

      login(data.data);

      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/dashboard/comapny");
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
        Reset Your Password
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <Lock className="absolute left-3 top-2.5 text-gray-500" />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border ${
              error ? "border-red-600" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600`}
          />
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          } flex justify-center items-center`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Submitting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
