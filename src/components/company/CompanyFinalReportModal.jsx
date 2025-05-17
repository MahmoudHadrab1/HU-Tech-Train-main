
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FileText, 
  Download, 
  Send, 
  User,
  Search,
  Loader2,
  Check,
  Upload,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";

const CompanyFinalReport = () => {
  const { auth } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reportFile, setReportFile] = useState(null);

  // Form state for additional report data (optional)
  const [reportForm, setReportForm] = useState({
    studentName: "",
    studentId: "",
    companyName: "",
    supervisorName: "",
    trainingTitle: "",
    overallRating: "",
    comments: "",
  });

  const templateUrl = '/templates/company_evaluation_form.pdf';

  // Fetch students who are in training with this company
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://railway-system-production-1a43.up.railway.app/api/companies/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter for students who are approved and selected (in training)
        const studentsInTraining = response.data?.data?.applications?.filter(
          app => app.status === "APPROVED" && app.selectedByStudent === true
        ).map(app => ({
          ...app.student,
          _id: app.student._id,
          name: app.student.name,
          department: app.student.department,
          applicationId: app._id,
          trainingPost: app.trainingPost
        }));

        setStudents(studentsInTraining);

        // Set company information from auth
        if (auth?.user?.profile) {
          const profile = auth.user.profile;
          setReportForm(prev => ({
            ...prev,
            companyName: profile.name || "",
            supervisorName: auth.user.name || ""
          }));
        }

      } catch (error) {
        console.error("Error fetching students:", error);
        Swal.fire({
          icon: "error",
          title: "Data Fetch Failed",
          text: error.response?.data?.message || "Could not load students",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [auth]);

  // Handle student selection
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setReportForm(prev => ({
      ...prev,
      studentName: student.name || "",
      studentId: student.studentId || "",
      trainingTitle: student.trainingPost?.title || "",
    }));
    setSubmitSuccess(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setReportFile(file);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Invalid File",
        text: "Please upload a PDF file only.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // Download template
  const handleDownloadTemplate = () => {
    window.open(templateUrl, '_blank');
  };

  // Validate form before submission
  const validateForm = () => {
    if (!selectedStudent) {
      Swal.fire({
        icon: 'warning',
        title: 'No Student Selected',
        text: 'Please select a student for this final report',
        confirmButtonColor: '#dc2626',
      });
      return false;
    }

    if (!reportFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No Report File',
        text: 'Please upload the completed evaluation form',
        confirmButtonColor: '#dc2626',
      });
      return false;
    }

    return true;
  };

  // Submit the final report
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add form fields
      formData.append("studentName", reportForm.studentName);
      formData.append("studentId", reportForm.studentId);
      formData.append("companyName", reportForm.companyName);
      formData.append("supervisorName", reportForm.supervisorName);
      formData.append("trainingTitle", reportForm.trainingTitle);
      formData.append("overallRating", reportForm.overallRating);
      formData.append("comments", reportForm.comments);
      
      // Add the PDF file
      formData.append("finalReport", reportFile);

      // Submit to the backend
      await axios.post(
        `https://railway-system-production-1a43.up.railway.app/api/companies/applications/${selectedStudent.applicationId}/final-report`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitSuccess(true);
      
      Swal.fire({
        icon: 'success',
        title: 'Report Submitted Successfully!',
        text: 'The final training report has been submitted to the system.',
        confirmButtonColor: '#16a34a',
      });

      // Reset form after successful submission
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedStudent(null);
        setReportFile(null);
        setReportForm(prev => ({
          ...prev,
          studentName: "",
          studentId: "",
          trainingTitle: "",
          overallRating: "",
          comments: "",
        }));
      }, 2000);

    } catch (error) {
      console.error('Error submitting final report:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Could not submit the final report',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(searchLower) || 
      student.studentId?.toString().toLowerCase().includes(searchLower) ||
      student.department?.toLowerCase().includes(searchLower)
    );
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
        <FileText className="w-7 h-7 text-red-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Submit Final Training Report</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Student</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          
          {filteredStudents.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No students found in training</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  onClick={() => handleSelectStudent(student)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStudent?._id === student._id
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                      <p className="text-sm text-gray-500">{student.department}</p>
                      <p className="text-sm text-blue-600">{student.trainingPost?.title}</p>
                    </div>
                    {selectedStudent?._id === student._id && (
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Form */}
        <div className="lg:col-span-2">
          {!selectedStudent ? (
            <div className="flex flex-col items-center justify-center h-96 text-center bg-gray-50 rounded-lg">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No Student Selected</h3>
              <p className="text-gray-500 max-w-md">
                Please select a student from the list to submit their final training report
              </p>
            </div>
          ) : submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-800 mb-2">Report Submitted Successfully!</h3>
              <p className="text-green-700">
                Thank you for submitting the final evaluation report for {selectedStudent.name}. 
                The report has been sent to the system.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Student Name:</p>
                    <p className="font-medium">{reportForm.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Student ID:</p>
                    <input
                      type="text"
                      name="studentId"
                      value={reportForm.studentId}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      placeholder="Enter student ID"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Training Position:</p>
                    <p className="font-medium">{reportForm.trainingTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Report Date:</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
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

              {/* Download Template */}
              <div className="text-center">
                <button 
                  onClick={handleDownloadTemplate} 
                  className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 mx-auto transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Evaluation Form Template
                </button>
              </div>

              {/* Additional Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Rating
                  </label>
                  <select
                    name="overallRating"
                    value={reportForm.overallRating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">Select Rating</option>
                    <option value="excellent">Excellent</option>
                    <option value="very-good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="satisfactory">Satisfactory</option>
                    <option value="needs-improvement">Needs Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supervisor Name
                  </label>
                  <input
                    type="text"
                    name="supervisorName"
                    value={reportForm.supervisorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Enter supervisor name"
                  />
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  value={reportForm.comments}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Any additional comments about the student's performance..."
                ></textarea>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Completed Evaluation Form *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="report-upload"
                  />
                  <label htmlFor="report-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {reportFile ? (
                        <span className="text-green-600 font-medium">{reportFile.name}</span>
                      ) : (
                        <>Click to upload PDF or drag and drop</>
                      )}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">PDF files only</p>
                  </label>
                </div>
              </div>

              {/* PDF Preview */}
              {templateUrl && !reportFile && (
                <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                  <div className="bg-gray-200 p-2 flex justify-between items-center">
                    <span className="text-sm text-gray-700">Template Preview</span>
                    <button 
                      onClick={handleDownloadTemplate} 
                      className="p-1 rounded-full hover:bg-gray-300"
                      title="Download Template"
                    >
                      <Download className="w-5 h-5"/>
                    </button>
                  </div>
                  <div className="p-4 h-[400px]">
                    <object 
                      data={`${templateUrl}#toolbar=0`}
                      type="application/pdf" 
                      width="100%" 
                      height="100%" 
                      className="w-full h-full"
                    >
                      <p>Your browser does not support viewing PDFs. 
                        <a href={templateUrl} download className="text-blue-600 hover:underline">
                          Download the PDF
                        </a> instead.
                      </p>
                    </object>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center ${
                    submitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Final Report
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyFinalReport;