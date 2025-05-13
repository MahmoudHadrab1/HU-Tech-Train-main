import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Swal from "sweetalert2";
import {
  Building2,
  User,
  Phone,
  MapPin,
  Briefcase,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const RegisterCompany = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    nationalId: "",
    name: "",
    phone: "",
    location: "",
    fieldOfWork: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.state?.nationalId) {
      setFormData((prev) => ({
        ...prev,
        nationalId: location.state.nationalId,
      }));
    }
  }, [location.state]);

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
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.fieldOfWork.trim())
      newErrors.fieldOfWork = "Field of work is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://railway-system-production-1a43.up.railway.app/api/auth/register/company",
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
        throw new Error(data.message || "Registration failed");
      }

      login(data.data);

      Swal.fire({
        icon: "success",
        title: "Registration Complete",
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
      setErrors((prev) => ({ ...prev, form: err.message }));
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
        className={`w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-1000 transform ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-6">
          <div 
            className={`flex items-center justify-center transition-all duration-700 delay-300 transform ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mr-3">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Register Your Company
            </h1>
          </div>
        </div>

        {/* Form body */}
        <div className="p-6">
          {errors.form && (
            <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50 text-red-600">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.form}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* National ID */}
            <div 
              className={`transition-all duration-700 delay-400 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
                National ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  placeholder="Enter National ID"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className={`pl-10 w-full border ${
                    errors.nationalId ? "border-red-600" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                  readOnly={location.state?.nationalId ? true : false}
                />
                {errors.nationalId && (
                  <p className="text-red-600 text-xs mt-1">{errors.nationalId}</p>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div 
              className={`transition-all duration-700 delay-500 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Company Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 w-full border ${
                    errors.name ? "border-red-600" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Two columns for Phone and Location */}
            <div 
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700 delay-600 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 w-full border ${
                      errors.phone ? "border-red-600" : "border-gray-300"
                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter Location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`pl-10 w-full border ${
                      errors.location ? "border-red-600" : "border-gray-300"
                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                  />
                  {errors.location && (
                    <p className="text-red-600 text-xs mt-1">{errors.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Field of Work */}
            <div 
              className={`transition-all duration-700 delay-700 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <label htmlFor="fieldOfWork" className="block text-sm font-medium text-gray-700 mb-1">
                Field of Work
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fieldOfWork"
                  name="fieldOfWork"
                  placeholder="Enter Field of Work"
                  value={formData.fieldOfWork}
                  onChange={handleChange}
                  className={`pl-10 w-full border ${
                    errors.fieldOfWork ? "border-red-600" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                />
                {errors.fieldOfWork && (
                  <p className="text-red-600 text-xs mt-1">{errors.fieldOfWork}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div 
              className={`transition-all duration-700 delay-800 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full border ${
                    errors.email ? "border-red-600" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div 
              className={`transition-all duration-700 delay-900 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Create a Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full border ${
                    errors.password ? "border-red-600" : "border-gray-300"
                  } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Security note */}
            <div 
              className={`text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start transition-all duration-700 delay-1000 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <span>Your information is securely stored and verified. We take data privacy seriously and adhere to industry standards for data protection.</span>
            </div>

            {/* Submit Button */}
            <div 
              className={`pt-2 transition-all duration-700 delay-1100 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Register Company
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div 
          className={`border-t border-gray-100 p-4 bg-gray-50 text-center transition-all duration-700 delay-1200 transform ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <a
              href="/login/company"
              className="text-gray-700 hover:text-gray-900 font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login/company");
              }}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;