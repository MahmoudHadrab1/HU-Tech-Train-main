import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  User, 
  Lock, 
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";

const Student = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
      if (!/^\d{7}$/.test(universityId)) {
        Swal.fire({
        title: "Invalid University ID",
        text: "University ID must be exactly 7 digits (numbers only)",
        icon: "warning",
        confirmButtonColor: "#dc2626",
         });
        setLoading(false);
      return;
   }
    try {
      const res = await axios.post(
        "https://railway-system-production-1a43.up.railway.app/api/auth/login/student",
        { universityId, password }
      );

      login(res.data.data);

      Swal.fire({
        title: "Success",
        text: "Logged in successfully!",
        icon: "success",
        confirmButtonColor: "#dc2626",
      });
      navigate("/dashboard/student");
    } catch (err) {
      Swal.fire({
        title: "Login Failed",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 items-center justify-center p-4">
      <div 
        className={`w-full max-w-6xl flex rounded-xl bg-white shadow-lg overflow-hidden transition-all duration-1000 transform ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Left panel - Welcome and features */}
        <div className="hidden md:block md:w-1/2 p-8 bg-white">
          <div className="h-full flex flex-col">
            {/* Graduation cap icon */}
            <div 
              className={`w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 transition-all duration-700 delay-300 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-red-600" fill="currentColor">
                <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 16L12 18.72L7 16V12.27L12 15L17 12.27V16Z"/>
              </svg>
            </div>
            
            {/* Welcome message */}
            <div>
              <h1 
                className={`text-3xl font-bold text-gray-800 mb-1 transition-all duration-700 delay-400 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Welcome Back, Student!
              </h1>
              <div 
                className={`h-1 w-16 bg-red-600 mb-4 transition-all duration-700 delay-500 transform origin-left ${
                  animate ? "scale-x-100" : "scale-x-0"
                }`}
              ></div>
              <p 
                className={`text-gray-600 mb-8 transition-all duration-700 delay-500 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Access your training portal to manage internships and connect with companies.
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
                    icon: <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>, 
                    text: "Track application status",
                    delay: 700
                  },
                  { 
                    icon: <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                          </svg>, 
                    text: "Submit reports and assignments",
                    delay: 800
                  },
                  { 
                    icon: <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                          </svg>, 
                    text: "Connect with partner companies",
                    delay: 900
                  },
                  { 
                    icon: <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                          </svg>, 
                    text: "Get feedback from industry mentors",
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
                    <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center mr-3">
                      {feature.icon}
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
              Your gateway to professional experience and career development
            </div>
          </div>
        </div>
        
        {/* Right panel - Login form */}
        <div className="w-full md:w-1/2 p-8 bg-white md:border-l md:border-gray-100">
          <div className="max-w-md mx-auto h-full flex flex-col">
            {/* User icon */}
            <div className="text-center mb-8">
              <div 
                className={`inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4 transition-all duration-700 delay-300 transform ${
                  animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
              >
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 
                className={`text-2xl font-bold text-gray-800 transition-all duration-700 delay-400 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Student Login
              </h2>
              <p 
                className={`text-gray-600 mt-2 transition-all duration-700 delay-500 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                Sign in to access your training portal
              </p>
            </div>
            
            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* University ID field */}
              <div 
                className={`transition-all duration-700 delay-600 transform ${
                  animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    placeholder="Enter your university ID"
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    required
                  />
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
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
                  className="w-full flex items-center justify-center bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
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

export default Student;