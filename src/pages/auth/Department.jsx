import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Swal from "sweetalert2";
import { 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  Eye,
  EyeOff,
  GraduationCap
} from "lucide-react";

const Department = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    if (!formData.email.trim()) newErrors.email = "Email is required";
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
        "https://railway-system-production-1a43.up.railway.app/api/auth/login/department-head",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      login(data.data);

      Swal.fire({
        icon: "success",
        title: "Logged In",
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/dashboard/department");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <div 
        className={`w-full max-w-6xl flex rounded-xl bg-white shadow-lg overflow-hidden transition-all duration-1000 transform ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Left panel - Welcome and features */}
        <div className="hidden md:block md:w-1/2 p-8 bg-white">
          <div className="h-full flex flex-col">
            {/* Department icon */}
            <div 
              className={`w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 transition-all duration-700 delay-300 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <GraduationCap className="w-10 h-10 text-gray-700" />
            </div>
            
            {/* Welcome message */}
            <div>
              <h1 
                className={`text-3xl font-bold text-gray-800 mb-1 transition-all duration-700 delay-400 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Welcome Back, Department!
              </h1>
              <div 
                className={`h-1 w-16 bg-gray-900 mb-4 transition-all duration-700 delay-500 transform origin-left ${
                  animate ? "scale-x-100" : "scale-x-0"
                }`}
              ></div>
              <p 
                className={`text-gray-600 mb-8 transition-all duration-700 delay-500 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Access your department portal to manage student internships and connect with companies.
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
                <div 
                  className={`flex items-center transition-all duration-500 transform ${
                    animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: "700ms" }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 mr-3" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
                  </svg>
                  <span className="text-gray-700">Review student internship applications</span>
                </div>
                
                <div 
                  className={`flex items-center transition-all duration-500 transform ${
                    animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: "800ms" }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 mr-3" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
                  </svg>
                  <span className="text-gray-700">Monitor student training progress</span>
                </div>
                
                <div 
                  className={`flex items-center transition-all duration-500 transform ${
                    animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: "900ms" }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 mr-3" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span className="text-gray-700">Approve company partnerships</span>
                </div>
                
                <div 
                  className={`flex items-center transition-all duration-500 transform ${
                    animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: "1000ms" }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 mr-3" fill="currentColor">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                  </svg>
                  <span className="text-gray-700">Generate performance reports</span>
                </div>
              </div>
            </div>
            
            {/* Footer text */}
            <div 
              className={`mt-auto text-sm text-gray-500 transition-all duration-700 delay-1100 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Your gateway to managing student internships effectively
            </div>
          </div>
        </div>
        
        {/* Right panel - Login form */}
        <div className="w-full md:w-1/2 p-8 bg-white md:border-l md:border-gray-100">
          <div className="max-w-md mx-auto h-full flex flex-col">
            {/* Education icon */}
            <div className="text-center mb-8">
              <div 
                className={`inline-flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full mb-4 transition-all duration-700 delay-300 transform ${
                  animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
              >
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <h2 
                className={`text-2xl font-bold text-gray-800 transition-all duration-700 delay-400 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Department Login
              </h2>
              <p 
                className={`text-gray-600 mt-2 transition-all duration-700 delay-500 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Sign in to access your department portal
              </p>
            </div>
            
            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div 
                className={`transition-all duration-700 delay-600 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your department email"
                    className={`pl-10 w-full border ${errors.email ? "border-red-600" : "border-gray-300"} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                    required
                  />
                  {errors.email && (
                    <div className="text-red-600 text-xs mt-1">{errors.email}</div>
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {errors.password && (
                    <div className="text-red-600 text-xs mt-1">{errors.password}</div>
                  )}
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;