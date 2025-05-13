/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from "lucide-react";

const Verify = () => {
  const [nationalId, setNationalId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async () => {
    if (!nationalId.trim()) {
      setError("Please enter a National ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://railway-system-production-1a43.up.railway.app/api/auth/verify-company/${nationalId}`
      );

      if (!response.ok) {
        throw new Error("Company not found or invalid ID");
      }

      const data = await response.json();

      setError("");

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Company Verified",
        text: "Verification successful. Proceeding to registration...",
        timer: 2000,
        showConfirmButton: false,
      });

      // Navigate after delay
      setTimeout(() => {
        navigate("/register/company", { state: { nationalId } });
      }, 2000);
    } catch (err) {
      setError(err.message || "Company not found or invalid ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <div 
        className={`w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-1000 transform ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="p-8">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <div 
              className={`inline-flex items-center justify-center w-20 h-20 bg-gray-700 rounded-full mb-4 transition-all duration-700 delay-300 transform ${
                animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h1 
              className={`text-2xl font-bold text-gray-800 transition-all duration-700 delay-400 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Company Registration
            </h1>
            <div 
              className={`h-1 w-24 bg-gray-700 mx-auto mb-4 transition-all duration-700 delay-500 transform origin-center ${
                animate ? "scale-x-100" : "scale-x-0"
              }`}
            ></div>
            <p 
              className={`text-gray-600 mt-3 max-w-md mx-auto text-sm transition-all duration-700 delay-500 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Before you register, we need to verify your company's National ID. 
              Please enter it below to continue with the registration process.
            </p>
          </div>

          {/* Verification Form */}
          <div 
            className={`transition-all duration-700 delay-600 transform ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="mb-6">
              <label
                htmlFor="nationalId"
                className="block mb-2 font-medium text-gray-700 text-sm"
              >
                National ID
              </label>
              <div className="flex gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nationalId"
                    type="text"
                    value={nationalId}
                    onChange={(e) => {
                      setNationalId(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter National ID"
                    className={`pl-10 w-full border ${
                      error ? "border-red-600" : "border-gray-300"
                    } rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700`}
                  />
                </div>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className={`bg-gray-700 text-white px-5 py-3 rounded-lg font-medium transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
                  } flex items-center justify-center min-w-[100px]`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Verify <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div 
                className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50 text-red-600 flex items-start"
              >
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Information box */}
            <div 
              className={`p-4 border border-blue-100 rounded-lg bg-blue-50 text-blue-700 flex items-start text-sm mt-6 transition-all duration-700 delay-700 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <HelpCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Why do we need this verification?</span>
                <p className="mt-1 text-blue-600">
                  We verify your company's National ID to ensure the security and 
                  authenticity of all registered companies on our platform. This helps 
                  maintain a trusted environment for students and educational institutions.
                </p>
              </div>
            </div>

            {/* Support text */}
            <div 
              className={`text-sm text-gray-500 mt-6 text-center transition-all duration-700 delay-800 transform ${
                animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              For assistance, please contact support at{" "}
              <a 
                href="mailto:support@company.com" 
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                support@company.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className={`bg-gray-50 border-t border-gray-100 p-4 text-center text-xs text-gray-500 transition-all duration-700 delay-900 transform ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-gray-400" />
            <span>Your information is secure and will be verified according to our policies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;