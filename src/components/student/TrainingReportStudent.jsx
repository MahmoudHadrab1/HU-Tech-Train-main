import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FileText, 
  Send, 
  Clock, 
  Building,
  GraduationCap,
  Calendar,
  Loader2,
  Download,
  Upload,
  User,
  UserCheck
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from "../../hooks/AuthContext";

const TrainingReportStudent = () => {
  const { auth } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [trainingStartDate, setTrainingStartDate] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    universityId: ""
  });

  const [form, setForm] = useState({
    trainingOverview: "",
    tasksCompleted: "",
    skillsLearned: "",
    challenges: "",
    feedback: "",
    overallExperience: "excellent" // Default value
  });

 
  useEffect(() => {
  const token = localStorage.getItem("token");

  // 👇 نأخذ بيانات الطالب من الـ Context
  if (auth?.user?.profile) {
    setStudentInfo({
      name: auth.user.profile.name || "",
      universityId: auth.user.profile.studentId?.toString() || ""
    });
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "https://railway-system-production-1a43.up.railway.app/api/students/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const approvedApplications = response.data.data?.applications?.filter(
        app => app.status === "APPROVED"
      );

      if (approvedApplications && approvedApplications.length > 0) {
        setApplications(approvedApplications);

        const selectedApp = approvedApplications.find(app => app.selectedByStudent === true);

        if (selectedApp) {
          setSelectedApplication(selectedApp);
          setTrainingStartDate(new Date(selectedApp.updatedAt));
        } else if (approvedApplications.length === 1) {
          setSelectedApplication(approvedApplications[0]);
          setTrainingStartDate(new Date(approvedApplications[0].updatedAt));
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
}, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to select an application 
  const selectApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `https://railway-system-production-1a43.up.railway.app/api/students/applications/${applicationId}/select`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the applications array to reflect the new selection
      setApplications(prevApps => 
        prevApps.map(app => ({
          ...app,
          selectedByStudent: app._id === applicationId
        }))
      );

      // Update the selected application
      const selected = applications.find(app => app._id === applicationId);
      if (selected) {
        const updatedApp = { ...selected, selectedByStudent: true };
        setSelectedApplication(updatedApp);
        setTrainingStartDate(new Date());
        
        Swal.fire({
          icon: "success",
          title: "Application Selected",
          text: "Your training application has been selected. You can now submit your report.",
          confirmButtonColor: "#16a34a",
        });
      }
    } catch (error) {
      console.error("Error selecting application:", error);
      Swal.fire({
        icon: "error",
        title: "Selection Failed",
        text: error.response?.data?.message || "Failed to select application. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header with logo placeholder
    doc.setFillColor(220, 38, 38); // Red color (tailwind red-600)
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("HU Tech-Train Training Report", 105, 12, { align: "center" });

    // Add student info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Training Report", 105, 30, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Student Name: ${studentInfo.name || "N/A"}`, 20, 40);
    doc.text(`University ID: ${studentInfo.universityId || "N/A"}`, 20, 50);
    doc.text(`Company: ${selectedApplication?.trainingPost?.company?.name || "N/A"}`, 20, 60);
    doc.text(`Position: ${selectedApplication?.trainingPost?.title || "N/A"}`, 20, 70);
    doc.text(`Duration: ${selectedApplication?.trainingPost?.duration || "N/A"} weeks`, 20, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 90);

    // Line separator
    doc.line(20, 95, 190, 95);
    
    // Add report content
    const startY = 105;
    const lineHeight = 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Training Overview", 20, startY);
    doc.setFont(undefined, 'normal');
    const overviewLines = doc.splitTextToSize(form.trainingOverview, 170);
    doc.text(overviewLines, 20, startY + lineHeight);
    
    const tasksY = startY + lineHeight + overviewLines.length * 7;
    doc.setFont(undefined, 'bold');
    doc.text("Tasks Completed", 20, tasksY);
    doc.setFont(undefined, 'normal');
    const tasksLines = doc.splitTextToSize(form.tasksCompleted, 170);
    doc.text(tasksLines, 20, tasksY + lineHeight);
    
    const skillsY = tasksY + lineHeight + tasksLines.length * 7;
    doc.setFont(undefined, 'bold');
    doc.text("Skills Learned", 20, skillsY);
    doc.setFont(undefined, 'normal');
    const skillsLines = doc.splitTextToSize(form.skillsLearned, 170);
    doc.text(skillsLines, 20, skillsY + lineHeight);
    
    const challengesY = skillsY + lineHeight + skillsLines.length * 7;
    doc.setFont(undefined, 'bold');
    doc.text("Challenges", 20, challengesY);
    doc.setFont(undefined, 'normal');
    const challengesLines = doc.splitTextToSize(form.challenges, 170);
    doc.text(challengesLines, 20, challengesY + lineHeight);
    
    const feedbackY = challengesY + lineHeight + challengesLines.length * 7;
    doc.setFont(undefined, 'bold');
    doc.text("Feedback for Program", 20, feedbackY);
    doc.setFont(undefined, 'normal');
    const feedbackLines = doc.splitTextToSize(form.feedback, 170);
    doc.text(feedbackLines, 20, feedbackY + lineHeight);
    
    const experienceY = feedbackY + lineHeight + feedbackLines.length * 7;
    doc.setFont(undefined, 'bold');
    doc.text("Overall Experience", 20, experienceY);
    doc.setFont(undefined, 'normal');
    doc.text(form.overallExperience.charAt(0).toUpperCase() + form.overallExperience.slice(1), 20, experienceY + lineHeight);
    
    // Add page numbers in the footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    // Return the blob for uploading
    const pdfBlob = doc.output('blob');
    setReportFile(pdfBlob);

    // Also save a copy for the user
    doc.save(`training_report_${studentInfo.universityId}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    return pdfBlob;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedApplication) {
      Swal.fire({
        icon: "error",
        title: "No Application Selected",
        text: "Please select a training application to submit a report for.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    // Check if the application is selected by the student
    if (!selectedApplication.selectedByStudent) {
      Swal.fire({
        icon: "warning",
        title: "Application Not Selected",
        text: "You need to select this training application before submitting a report.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    // Validation
    for (const [key, value] of Object.entries(form)) {
      if (!value.trim() && key !== "overallExperience") {
        Swal.fire({
          icon: "error",
          title: "Incomplete Form",
          text: `Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          confirmButtonColor: "#dc2626",
        });
        return;
      }
    }

    setSubmitLoading(true);

    try {
      // Generate PDF first
      const pdfBlob = generatePDF();

      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append('finalReport', pdfBlob, `training_report_${studentInfo.universityId}_${selectedApplication._id}.pdf`);
      
      // Also add student information to the form data
      formData.append('studentName', studentInfo.name);
      formData.append('universityId', studentInfo.universityId);
      formData.append('applicationId', selectedApplication._id);

      const token = localStorage.getItem("token");
      
      // Use the exact endpoint from your screenshot
      await axios.post(
        "https://railway-system-production-1a43.up.railway.app/api/students/training/report",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Report Submitted Successfully",
        text: "Your training report has been submitted successfully!",
        confirmButtonColor: "#16a34a",
      });

      // Reset form after successful submission
      setForm({
        trainingOverview: "",
        tasksCompleted: "",
        skillsLearned: "",
        challenges: "",
        feedback: "",
        overallExperience: "excellent"
      });
      setReportFile(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      
      // Handle the specific error for the 8-week requirement
      const errorMessage = error.response?.data?.message || "Failed to submit report. Please try again.";
      
      if (errorMessage.includes("8 weeks")) {
        // For the 8-week error, offer to save the PDF anyway
        Swal.fire({
          icon: "warning",
          title: "Training Period Requirement",
          text: errorMessage,
          showCancelButton: true,
          confirmButtonColor: "#16a34a",
          cancelButtonColor: "#dc2626",
          confirmButtonText: "Download Report PDF Anyway",
          cancelButtonText: "Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
            // Just generate the PDF without submitting to the server
            generatePDF();
          }
        });
      } else {
        // For other errors, show standard error message
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: errorMessage,
          confirmButtonColor: "#dc2626",
        });
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Loading training information...
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-lg shadow-md">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Approved Training Found</h3>
          <p className="text-gray-600 mb-4">
            You need to have a training approved by a company before submitting a report.
          </p>
          <p className="text-sm text-gray-500">
            Please go to the Training Posts section, apply for training opportunities, and wait for company approval.
          </p>
        </div>
      </div>
    );
  }

  // Check if there's already a selected application
  const hasSelectedApp = applications.some(app => app.selectedByStudent === true);
  
  // If no application is selected yet, show the selection screen
  if (!hasSelectedApp && applications.some(app => app.status === "APPROVED")) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-lg shadow-md">
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
            <FileText className="w-6 h-6 text-red-600 mr-3" />
            Select Your Training
          </h2>
          <p className="text-gray-600">
            You have received approval from one or more companies. Please select which training you would like to pursue.
          </p>
        </div>

        <div className="space-y-6">
          {applications
            .filter(app => app.status === "APPROVED")
            .map(app => (
              <div 
                key={app._id}
                className="border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{app.trainingPost.title}</h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-2 text-gray-500" />
                      {app.trainingPost.company.name}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      Duration: {app.trainingPost.duration} weeks
                    </p>
                  </div>
                  <button
                    onClick={() => selectApplication(app._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Select This Training
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // If we have a selected application but it's not set in the component state
  if (hasSelectedApp && !selectedApplication) {
    const selected = applications.find(app => app.selectedByStudent === true);
    setSelectedApplication(selected);
    setTrainingStartDate(new Date(selected.updatedAt));
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Loading selected training...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 my-8 bg-white rounded-lg shadow-md">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
          <FileText className="w-6 h-6 text-red-600 mr-3" />
          Training Report Submission
        </h2>
        <p className="text-gray-600">
          Submit a comprehensive report about your training experience at the company.
        </p>
      </div>

      {/* Student Information */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <UserCheck className="w-5 h-5 text-blue-600 mr-2" />
          Student Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <User className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">
                {studentInfo.name || "Not available"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <GraduationCap className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">University ID</p>
              <p className="font-medium">
                {studentInfo.universityId || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Training Information */}
      {selectedApplication && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Selected Training Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Building className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">
                  {selectedApplication?.trainingPost?.company?.name || "N/A"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <GraduationCap className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">
                  {selectedApplication?.trainingPost?.title || "N/A"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {selectedApplication?.trainingPost?.duration || "N/A"} weeks
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">
                  {selectedApplication?.status?.toLowerCase() || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Training Period Information */}
          {trainingStartDate && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Training Period</p>
                  <p className="font-medium">
                    Started on {trainingStartDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="trainingOverview" 
            className="block mb-2 font-medium text-gray-700"
          >
            Training Overview
          </label>
          <textarea
            id="trainingOverview"
            name="trainingOverview"
            value={form.trainingOverview}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            placeholder="Provide a general overview of your training experience..."
          ></textarea>
        </div>

        <div>
          <label 
            htmlFor="tasksCompleted" 
            className="block mb-2 font-medium text-gray-700"
          >
            Tasks Completed
          </label>
          <textarea
            id="tasksCompleted"
            name="tasksCompleted"
            value={form.tasksCompleted}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            placeholder="Describe the main tasks and projects you worked on..."
          ></textarea>
        </div>

        <div>
          <label 
            htmlFor="skillsLearned" 
            className="block mb-2 font-medium text-gray-700"
          >
            Skills Learned
          </label>
          <textarea
            id="skillsLearned"
            name="skillsLearned"
            value={form.skillsLearned}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            placeholder="List the skills and knowledge you acquired during the training..."
          ></textarea>
        </div>

        <div>
          <label 
            htmlFor="challenges" 
            className="block mb-2 font-medium text-gray-700"
          >
            Challenges Faced
          </label>
          <textarea
            id="challenges"
            name="challenges"
            value={form.challenges}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            placeholder="Describe any challenges you encountered and how you addressed them..."
          ></textarea>
        </div>

        <div>
          <label 
            htmlFor="feedback" 
            className="block mb-2 font-medium text-gray-700"
          >
            Feedback for Training Program
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={form.feedback}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            placeholder="Provide constructive feedback about the training program..."
          ></textarea>
        </div>

        <div>
          <label 
            htmlFor="overallExperience" 
            className="block mb-2 font-medium text-gray-700"
          >
            Overall Experience
          </label>
          <select
            id="overallExperience"
            name="overallExperience"
            value={form.overallExperience}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="satisfactory">Satisfactory</option>
            <option value="needs improvement">Needs Improvement</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* File display if a report has been generated */}
        {reportFile && (
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg flex items-center">
            <FileText className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-700">Report PDF generated and ready for submission</span>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-4">
          <button
            type="submit"
            disabled={submitLoading}
            className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors ${
              submitLoading ? "opacity-70 cursor-not-allowed" : ""
            } flex items-center justify-center font-medium`}
          >
            {submitLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Generate & Submit Final Report
              </>
            )}
          </button>
          
          {/* Preview Report Button */}
          <button
            type="button"
            onClick={() => generatePDF()}
            className="w-full border border-red-600 text-red-600 hover:bg-red-50 py-3 rounded-lg transition-colors flex items-center justify-center font-medium"
          >
            <Download className="mr-2 h-5 w-5" />
            Preview Report as PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingReportStudent;