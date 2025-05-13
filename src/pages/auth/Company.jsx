import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { Building, Lock, Loader2, X, Eye, EyeOff, ArrowRight, Building2 } from "lucide-react";
import Swal from "sweetalert2";

const Company = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nationalId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nationalId.trim())
      newErrors.nationalId = "National ID is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://railway-system-production-1a43.up.railway.app/api/auth/login/company",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.data);

      Swal.fire({
        title: "Success",
        text: "Logged in successfully!",
        icon: "success",
        confirmButtonColor: "#dc2626",
      });
      navigate("/dashboard/comapny");
    } catch (err) {
      Swal.fire({
        title: "Login Failed",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);

    try {
      const response = await fetch(
        "https://railway-system-production-1a43.up.railway.app/api/auth/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setForgotSuccess("Check your inbox for reset instructions.");
      setForgotEmail("");
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 items-center justify-center p-4">
        <div 
          className={`w-full max-w-6xl flex rounded-xl bg-white shadow-lg overflow-hidden transition-all duration-1000 transform ${
            animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Left panel - Welcome and features */}
          <div className="hidden md:block md:w-1/2 p-8 bg-white">
            <div className="h-full flex flex-col">
              {/* Building icon */}
              <div 
                className={`w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 transition-all duration-700 delay-300 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-700" fill="currentColor">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
              </div>
              
              {/* Welcome message */}
              <div>
                <h1 
                  className={`text-3xl font-bold text-gray-800 mb-1 transition-all duration-700 delay-400 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  Welcome Back, Company!
                </h1>
                <div 
                  className={`h-1 w-16 bg-gray-700 mb-4 transition-all duration-700 delay-500 transform origin-left ${
                    animate ? "scale-x-100" : "scale-x-0"
                  }`}
                ></div>
                <p 
                  className={`text-gray-600 mb-8 transition-all duration-700 delay-500 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  Access your company portal to manage your internship offerings and connect with students.
                </p>
              </div>
              
              {/* Features section */}
              <div 
                className={`mb-8 transition-all duration-700 delay-600 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Portal Features
                </h2>
                
                <div className="space-y-4 mt-5">
                  {[
                    { 
                      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
                            </svg>, 
                      text: "Post internship opportunities",
                      delay: 700
                    },
                    { 
                      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"/>
                            </svg>, 
                      text: "Review student applications",
                      delay: 800
                    },
                    { 
                      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>, 
                      text: "Manage training programs",
                      delay: 900
                    },
                    { 
                      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                            </svg>, 
                      text: "Submit evaluation reports",
                      delay: 1000
                    }
                  ].map((feature, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center transition-all duration-500 transform ${
                        animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                      style={{ transitionDelay: `${feature.delay}ms` }}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <div className="text-gray-700">{feature.icon}</div>
                      </div>
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer message */}
              <div 
                className={`mt-auto text-sm text-gray-500 transition-all duration-700 delay-1100 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Your gateway to finding talented students for internships
              </div>
            </div>
          </div>
          
          {/* Right panel - Login form */}
          <div className="w-full md:w-1/2 p-8 bg-white md:border-l md:border-gray-100">
            <div className="max-w-md mx-auto h-full flex flex-col">
              {/* Company icon */}
              <div className="text-center mb-8">
                <div 
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full mb-4 transition-all duration-700 delay-300 transform ${
                    animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                >
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <h2 
                  className={`text-2xl font-bold text-gray-800 transition-all duration-700 delay-400 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  Company Login
                </h2>
                <p 
                  className={`text-gray-600 mt-2 transition-all duration-700 delay-500 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  Sign in to access your company portal
                </p>
              </div>
              
              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* National ID field */}
                <div 
                  className={`transition-all duration-700 delay-600 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    National ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      placeholder="Enter your National ID"
                      className={`pl-10 w-full border ${errors.nationalId ? "border-red-600" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                      required
                    />
                    {errors.nationalId && (
                      <div className="text-red-600 text-xs mt-1">{errors.nationalId}</div>
                    )}
                  </div>
                </div>
                
                {/* Password field */}
                <div 
                  className={`transition-all duration-700 delay-700 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 w-full border ${errors.password ? "border-red-600" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {errors.password && (
                      <div className="text-red-600 text-xs mt-1">{errors.password}</div>
                    )}
                  </div>
                </div>
                
                {/* Forgot Password */}
                <div 
                  className={`flex items-center justify-end transition-all duration-700 delay-750 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Forgot password?
                  </button>
                </div>
                
                {/* Login button */}
                <div 
                  className={`transition-all duration-700 delay-800 transform ${
                    animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Logging in...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Log In <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
              
              {/* Register option */}
              <div 
                className={`mt-6 text-center transition-all duration-700 delay-900 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="text-sm text-gray-500">Don't have an account yet? </span>
                <a 
                  href="/verify" 
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Register Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal - Kept exactly as in the original code */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotEmail("");
                setForgotError("");
                setForgotSuccess("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Reset Your Password
            </h3>
            <form onSubmit={handleForgotPasswordSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              {forgotError && (
                <p className="text-red-600 text-sm mb-2">{forgotError}</p>
              )}
              {forgotSuccess && (
                <p className="text-green-600 text-sm mb-2">{forgotSuccess}</p>
              )}
              <button
                type="submit"
                disabled={forgotLoading}
                className={`w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition ${
                  forgotLoading ? "opacity-70 cursor-not-allowed" : ""
                } flex justify-center items-center`}
              >
                {forgotLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Company;