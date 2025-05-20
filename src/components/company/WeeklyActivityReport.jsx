/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FileText, 
  Download, 
  Send, 
  Plus,
  Calendar,
  User,
  Search,
  Loader2
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useAuth } from "../../hooks/AuthContext";

const CompanyActivityReports = () => {
  const { auth } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("write");
   
  const [selectedReport, setSelectedReport] = useState(null);
 
const [previousReports, setPreviousReports] = useState([]);

  const [reportForm, setReportForm] = useState({
    studentName: "",
    studentId: "", // سيتم تعبئته من الشركة يدويًا
    companyName: "",
    supervisorName: "",
    weekNumber: "",
    startDate: "",
    endDate: "",
    activitiesSummary: "",
    challengesFaced: "",
    supervisorComments: "",
  });

  const [skillsList, setSkillsList] = useState(['']);

  useEffect(() => {
    const fetchData = async () => {
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

        const applications = response.data?.data?.applications || [];

const selectedStudents = applications
  .filter(app => {
    const hasOfficialDoc = !!app.officialDocument;
    const hasStudentFinal = !!app.finalReportByStudent;
    const hasCompanyFinal = !!app.finalReportByCompany;

    // ✅ حالة in training فقط
    return (
      app.status === "APPROVED" &&
      app.selectedByStudent &&
      hasOfficialDoc &&
      (!hasStudentFinal || !hasCompanyFinal)
    );
  })
  .map(app => ({
    ...app.student,
    _id: app.student._id,
    name: app.student.name,
    department: app.student.department,
    applicationId: app._id 
  }));

        setStudents(selectedStudents);

        if (auth?.user?.profile) {
          const profile = auth.user.profile;
          setReportForm(prev => ({
            ...prev,
            companyName: profile.name || "",
            supervisorName: auth.user.name || ""
          }));
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Data Fetch Failed",
          text: error.response?.data?.message || "Could not load information",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth]);
  
  // Handle selecting a student
  const handleSelectStudent = (student) => {
  setSelectedStudent(student); // يحتوي على _id
  setReportForm(prev => ({
    ...prev,
    studentName: student.name || "",
    studentId: student.studentId || "", // هذا يتم إدخاله يدويًا
  }));
};

  
  // Handle viewing a previous report
  const handleViewPreviousReport = (report) => {
    setActiveView("view");
    setReportForm({
      studentName: report.studentName || "",
      studentId: report.studentId || "",
      companyName: report.companyName || "",
      supervisorName: report.supervisorName || "",
      weekNumber: report.weekNumber || "",
      startDate: report.startDate ? report.startDate.split("T")[0] : "",
      endDate: report.endDate ? report.endDate.split("T")[0] : "",
      activitiesSummary: report.activitiesSummary || "",
      challengesFaced: report.challengesFaced || "",
      supervisorComments: report.supervisorComments || "",
    });
    setSkillsList(report.skillsLearned || ['']);
  };
  
  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skillsList];
    updatedSkills[index] = value;
    setSkillsList(updatedSkills);
  };
  
  const addSkill = () => {
    setSkillsList([...skillsList, '']);
  };
  
  const removeSkill = (index) => {
    const updatedSkills = skillsList.filter((_, i) => i !== index);
    setSkillsList(updatedSkills);
  };
  
  // Form validation
  const validateForm = () => {
    const requiredFields = [
      'weekNumber', 
      'startDate', 
      'endDate', 
      'activitiesSummary', 
      'challengesFaced'
    ];
    
    for (const field of requiredFields) {
      if (!reportForm[field]?.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Information',
          text: `Please fill out the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`,
          confirmButtonColor: '#dc2626',
        });
        return false;
      }
    }
    
    if (!skillsList.some(skill => skill.trim())) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Skills',
        text: 'Please add at least one skill learned by the student',
        confirmButtonColor: '#dc2626',
      });
      return false;
    }
    
    if (!selectedStudent) {
      Swal.fire({
        icon: 'warning',
        title: 'No Student Selected',
        text: 'Please select a student for this report',
        confirmButtonColor: '#dc2626',
      });
      return false;
    }
    
    return true;
  };
  
  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFillColor(220, 38, 38); // Red color (tailwind red-600)
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Weekly Training Activity Report', 105, 12, { align: 'center' });
    
    // Add student information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Student: ${reportForm.studentName} (${reportForm.studentId})`, 20, 40);
    doc.text(`Company: ${reportForm.companyName}`, 20, 50);
    doc.text(`Supervisor: ${reportForm.supervisorName}`, 20, 60);
    doc.text(`Week: ${reportForm.weekNumber} (${reportForm.startDate} to ${reportForm.endDate})`, 20, 70);
    
    // Add report content
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Activities Summary', 20, 90);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const activitiesLines = doc.splitTextToSize(reportForm.activitiesSummary, 170);
    doc.text(activitiesLines, 20, 100);
    
    let yPosition = 100 + (activitiesLines.length * 7);
    
    // Skills learned
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Skills Learned', 20, yPosition + 10);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    yPosition += 20;
    
     
    skillsList.forEach((skill, index) => {
      if (skill.trim()) {
        doc.text(`• ${skill}`, 25, yPosition);
        yPosition += 7;
      }
    });
    
    // Challenges faced
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Challenges Faced', 20, yPosition + 10);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const challengesLines = doc.splitTextToSize(reportForm.challengesFaced, 170);
    doc.text(challengesLines, 20, yPosition + 20);
    
    yPosition += 20 + (challengesLines.length * 7);
    
    // Supervisor comments
    if (reportForm.supervisorComments.trim()) {
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text('Supervisor Comments', 20, yPosition + 10);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const commentsLines = doc.splitTextToSize(reportForm.supervisorComments, 170);
      doc.text(commentsLines, 20, yPosition + 20);
    }
    
    // Company signature
    yPosition += (reportForm.supervisorComments.trim() ? 
                 doc.splitTextToSize(reportForm.supervisorComments, 170).length * 7 + 20 : 
                 challengesLines.length * 7 + 20);
                 
    // Signature line                  
    doc.text("Company Representative Signature", 105, yPosition + 10, { align: "center" });
    yPosition += 15;
    doc.line(65, yPosition, 145, yPosition);
    
    // Add date
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, yPosition + 10, { align: "center" });
    
    // Save the PDF
    doc.save(`Weekly_Report_${reportForm.studentName}_Week${reportForm.weekNumber}.pdf`);
  };
  
  // Submit report
// Submit report
// Submit report
// Submit report
const submitReport = async () => {
  if (!validateForm()) {
    return;
  }
  
  setSubmitting(true);
  
  try {
    const token = localStorage.getItem('token');
    
    // Create FormData object
    const formData = new FormData();
    
    // Add form fields
    formData.append("studentName", reportForm.studentName);
    formData.append("studentId", reportForm.studentId);
    formData.append("companyName", reportForm.companyName);
    formData.append("supervisorName", reportForm.supervisorName);
    formData.append("weekNumber", reportForm.weekNumber);
    formData.append("startDate", reportForm.startDate);
    formData.append("endDate", reportForm.endDate);
    formData.append("activitiesSummary", reportForm.activitiesSummary);
    formData.append("challengesFaced", reportForm.challengesFaced);
    formData.append("supervisorComments", reportForm.supervisorComments);
    
    // Add skills as a JSON string
    const filteredSkills = skillsList.filter(skill => skill.trim());
    formData.append("skillsLearned", JSON.stringify(filteredSkills));
    
    // Create a properly formatted PDF file with all report data
    const doc = new jsPDF();
    
    // Add header
    doc.setFillColor(220, 38, 38); // Red color (tailwind red-600)
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Weekly Training Activity Report', 105, 12, { align: 'center' });
    
    // Add student information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Student: ${reportForm.studentName} (${reportForm.studentId})`, 20, 40);
    doc.text(`Company: ${reportForm.companyName}`, 20, 50);
    doc.text(`Supervisor: ${reportForm.supervisorName}`, 20, 60);
    doc.text(`Week: ${reportForm.weekNumber} (${reportForm.startDate} to ${reportForm.endDate})`, 20, 70);
    
    // Add report content
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Activities Summary', 20, 90);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const activitiesLines = doc.splitTextToSize(reportForm.activitiesSummary, 170);
    doc.text(activitiesLines, 20, 100);
    
    let yPosition = 100 + (activitiesLines.length * 7);
    
    // Skills learned
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Skills Learned', 20, yPosition + 10);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    yPosition += 20;
    
    filteredSkills.forEach((skill, index) => {
      if (skill.trim()) {
        doc.text(`• ${skill}`, 25, yPosition);
        yPosition += 7;
      }
    });
    
    // Challenges faced
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38);
    doc.text('Challenges Faced', 20, yPosition + 10);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const challengesLines = doc.splitTextToSize(reportForm.challengesFaced, 170);
    doc.text(challengesLines, 20, yPosition + 20);
    
    yPosition += 20 + (challengesLines.length * 7);
    
    // Supervisor comments
    if (reportForm.supervisorComments.trim()) {
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text('Supervisor Comments', 20, yPosition + 10);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const commentsLines = doc.splitTextToSize(reportForm.supervisorComments, 170);
      doc.text(commentsLines, 20, yPosition + 20);
    }
    
    // Convert the PDF to a blob
    const pdfBlob = new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
    formData.append("activityReport", pdfBlob, `Weekly_Report_${reportForm.studentName}_Week${reportForm.weekNumber}.pdf`);
    
    // Make the request
    await axios.post(
      `https://railway-system-production-1a43.up.railway.app/api/companies/applications/${selectedStudent.applicationId}/activity`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    Swal.fire({
      icon: 'success',
      title: 'Report Submitted',
      text: 'Weekly activity report has been submitted successfully',
      confirmButtonColor: '#16a34a',
    });
    
    // Reset form after submission
    setReportForm(prev => ({
      ...prev,
      weekNumber: '',
      startDate: '',
      endDate: '',
      activitiesSummary: '',
      challengesFaced: '',
      supervisorComments: '',
    }));
    setSkillsList(['']);
    setSelectedStudent(null);
    
  } catch (error) {
    console.error('Error submitting report:', error);
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: error.response?.data?.message || 'Could not submit the report',
      confirmButtonColor: '#dc2626',
    });
  } finally {
    setSubmitting(false);
  }
};
  
  // Reset form to create a new report
  const resetForm = () => {
    setActiveView("write");
    
    setReportForm(prev => ({
      ...prev,
      studentName: selectedStudent?.name || "",
      studentId: selectedStudent?.studentId || "",
      weekNumber: '',
      startDate: '',
      endDate: '',
      activitiesSummary: '',
      challengesFaced: '',
      supervisorComments: '',
    }));
    setSkillsList(['']);
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
  
  // Filter reports based on search term
  const filteredReports = previousReports.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    return (
      report.studentName?.toLowerCase().includes(searchLower) || 
      report.studentId?.toString().toLowerCase().includes(searchLower) ||
      report.weekNumber?.toString().includes(searchLower)
    );
  });
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <FileText className="w-7 h-7 text-red-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Weekly Activity Reports</h1>
        </div>
        
        <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Tab buttons */}
          <div className="bg-white-100 rounded-lg p-1 flex">
           {/*  <button
              onClick={() => setActiveView("write")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeView === "write"
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Write Report
            </button> */}
           {/*  <button
              onClick={() => {
                setActiveView("previous");
                // setSelectedReport(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeView === "previous"
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Previous Reports
            </button> */}
          </div>
          
          {/* Search */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 w-full sm:w-auto"
            />
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      {activeView === "write" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Student</h2>
            {/* Search Box Below Title */}
<div className="relative mb-4">
  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
  <input
    type="text"
    placeholder="Search by name or ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-9 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
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
            <form className="space-y-6">
              {/* Student and Company Information - Read-only */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={reportForm.studentName}
                    readOnly
                    className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                  />
                </div>
                
                {/* Student ID field - change from read-only to editable */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                    type="text"
                    name="studentId"
                    value={reportForm.studentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={reportForm.companyName}
                    readOnly
                    className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Name</label>
                  <input
                    type="text"
                    name="supervisorName"
                    value={reportForm.supervisorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
              
              {/* Report Week Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Week Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="weekNumber"
                    value={reportForm.weekNumber}
                    onChange={handleInputChange}
                    min="1"
                    max="52"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={reportForm.startDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      value={reportForm.endDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Activities Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activities Summary <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="activitiesSummary"
                  value={reportForm.activitiesSummary}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Provide a summary of the student's activities this week..."
                  required
                ></textarea>
              </div>
              
              {/* Skills Learned */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Skills Learned <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center text-xs font-medium text-red-600 hover:text-red-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </button>
                </div>
                
                <div className="space-y-2">
                  {skillsList.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                        placeholder={`Skill ${index + 1}`}
                        required
                      />
                      {skillsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Challenges Faced */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Challenges Faced <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="challengesFaced"
                  value={reportForm.challengesFaced}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Describe any challenges or obstacles encountered..."
                  required
                ></textarea>
              </div>
              
              {/* Supervisor Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supervisor Comments
                </label>
                <textarea
                  name="supervisorComments"
                  value={reportForm.supervisorComments}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="Additional comments or feedback for the student..."
                ></textarea>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={generatePDF}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Preview as PDF
                </button>
                <button
                  type="button"
                  onClick={submitReport}
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {activeView === "previous" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Submitted Reports</h2>
            
            {filteredReports.length === 0 ? (
              <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No reports found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => handleViewPreviousReport(report)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport?._id === report._id
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {report.studentName}
                        </h3>
                        <p className="text-sm text-gray-600">Week {report.weekNumber}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>
                            {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Report Details */}
          <div className="lg:col-span-2">
            {!selectedReport ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Report Selected</h3>
                <p className="text-gray-500 max-w-md">
                  Select a report from the list to view details
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Report Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Week {selectedReport.weekNumber} Report
                    </h2>
                    <p className="text-gray-600">
                      {new Date(selectedReport.startDate).toLocaleDateString()} - {new Date(selectedReport.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={generatePDF}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                </div>
                
                {/* Student Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Student Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name:</p>
                      <p className="font-medium">{selectedReport.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID:</p>
                      <p className="font-medium">{selectedReport.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company:</p>
                      <p className="font-medium">{selectedReport.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Supervisor:</p>
                      <p className="font-medium">{selectedReport.supervisorName}</p>
                    </div>
                  </div>
                </div>
                
                {/* Report Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Activities Summary</h3>
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedReport.activitiesSummary}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Skills Learned</h3>
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                      <ul className="list-disc list-inside text-gray-700">
                        {selectedReport.skillsLearned?.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Challenges Faced</h3>
                    <div className="bg-white p-4 border border-gray-200 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedReport.challengesFaced}</p>
                    </div>
                  </div>
                  
                  {selectedReport.supervisorComments && (
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Supervisor Comments</h3>
                      <div className="bg-white p-4 border border-gray-200 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">{selectedReport.supervisorComments}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Back Button */}
                <div className="pt-4 flex justify-end border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
                  >
                    Back to New Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyActivityReports;