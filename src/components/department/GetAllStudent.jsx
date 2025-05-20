/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Loader2, 
  AlertCircle, 
  Search, 
  Download, 
  User,
  FileText,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
  Calendar,
  Users,
  Filter,
  X,
  RotateCcw
} from "lucide-react";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import autoTable from "jspdf-autotable";

const GetAllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, filter, searchQuery]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://railway-system-production-1a43.up.railway.app/api/department-heads/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

const filterStudents = () => {
  const filtered = students.filter((student) => {
    const matchesSearch =
      searchQuery === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toString().includes(searchQuery);

    const hasWaitingApprovalApp =
      student.applications?.some(
        (app) => app.status === "APPROVED" && !app.officialDocument
      );

    let matchesFilter = false;

    if (filter === "ALL") {
      matchesFilter = true;
    } else if (filter === "WAITING_APPROVAL") {
      matchesFilter =
        student.trainingStatus === "WAITING_FOR_APPROVAL" ||
        (student.trainingStatus === "NOT_STARTED" && hasWaitingApprovalApp);
    } else {
      matchesFilter = student.trainingStatus === filter;
    }

    return matchesSearch && matchesFilter;
  });

  setFilteredStudents(filtered);
};



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilter("ALL");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-700";
      case "WAITING_APPROVAL":
        return "bg-yellow-100 text-yellow-700";
      case "IN_TRAINING":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return "Not Started";
      case "WAITING_APPROVAL":
        return "Waiting Approval";
      case "IN_TRAINING":
        return "In Training";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  const getStudentCompany = (student) => {
    if (!student.applications || student.applications.length === 0) return null;
    
    // Find approved application
    const approvedApp = student.applications.find(app => app.status === "APPROVED");
    return approvedApp ? approvedApp.trainingPost.company.name : null;
  };

  const handlePrint = () => {
    // Only print students who are in training or completed
    const printableStudents = students.filter(
  (student) =>
    student.trainingStatus === "IN_TRAINING" ||
    student.trainingStatus === "COMPLETED"
);


    if (printableStudents.length === 0) {
     Swal.fire({
    icon: "warning",
    title: "No Students to Print",
    text: "There are no students currently in training or who have completed training.",
    confirmButtonColor: "#dc2626"
  });
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'A4'
    });

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(220, 53, 69);
    doc.text("HU-TechTrain", 40, 40);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Student Training Progress Report", 40, 70);
    
    // Format date
     const today = new Date();
     const year = today.getFullYear(); 
     const month = String(today.getMonth() + 1).padStart(2, '0'); 
     const day = String(today.getDate()).padStart(2, '0'); 

     const formattedDate = `${year}/${month}/${day}`; 

    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${formattedDate}`, 40, 90);

    const tableColumn = ["Name", "Student ID", "Department", "Company", "Hours", "Status"];
    const tableRows = printableStudents.map((student) => [
      student.name || "-",
      student.studentId || "-",
      student.department || "-",
      getStudentCompany(student) || "Not Assigned",
      student.completedHours || "0",
      getStatusDisplayName(student.trainingStatus)
    ]);

    autoTable(doc, {
      startY: 100,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 11,
        cellPadding: 8,
        halign: 'left',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 100, left: 40, right: 40 },
      tableWidth: 'auto'
    });

    doc.save(`students_training_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const getStatusCounts = () => {
  const counts = {
    ALL: students.length,
    NOT_STARTED: 0,
    WAITING_APPROVAL: 0,
    IN_TRAINING: 0,
    COMPLETED: 0,
  };

  students.forEach((student) => {
    const hasWaitingApprovalApp =
      student.applications?.some(
        (app) => app.status === "APPROVED" && !app.officialDocument
      );

    if (
      student.trainingStatus === "WAITING_FOR_APPROVAL" ||
      (student.trainingStatus === "NOT_STARTED" && hasWaitingApprovalApp)
    ) {
      counts.WAITING_APPROVAL++;
    } else if (student.trainingStatus in counts) {
      counts[student.trainingStatus]++;
    } else {
      counts.NOT_STARTED++;
    }
  });

  return counts;
};


  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="bg-red-100 p-3 rounded-xl mr-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Department Students</h2>
            <p className="text-gray-600 mt-1">Manage and track student training progress</p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center font-medium shadow-md"
        >
          <Download className="w-5 h-5 mr-2" />
          Print Students In Training or Completed
        </button>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { key: "ALL", label: "All Students", color: "bg-gray-500", icon: Users },
          { key: "NOT_STARTED", label: "Not Started", color: "bg-gray-500", icon: Clock },
          { key: "WAITING_APPROVAL", label: "Waiting Approval", color: "bg-yellow-500", icon: Clock },
          { key: "IN_TRAINING", label: "In Training", color: "bg-blue-500", icon: User },
          { key: "COMPLETED", label: "Completed", color: "bg-green-500", icon: CheckCircle }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                filter === item.key
                  ? `${item.color} bg-opacity-10 border-current text-gray-800`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{statusCounts[item.key]}</p>
                </div>
                <Icon className={`w-8 h-8 ${filter === item.key ? item.color.replace('bg-', 'text-') : 'text-gray-400'}`} />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or student ID..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Results summary */}
      <div className="text-sm text-gray-600 mb-6 flex items-center justify-between">
        <span>Showing {filteredStudents.length} of {students.length} students</span>
        {filter !== "ALL" && (
          <span className="text-red-600 font-medium">
            Filter: {getStatusDisplayName(filter)}
          </span>
        )}
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-700 mb-2">No students found</p>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const company = getStudentCompany(student);
            const hasPendingApps = student.applications && 
              student.applications.some(app => app.status === "UNDER_REVIEW");
            
            return (
              <div
                key={student._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleStudentClick(student)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors">
                        {student.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: {student.studentId}</span>
                        <span>•</span>
                        <span>{student.department}</span>
                        {company && (
                          <>
                            <span>•</span>
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              <span>{company}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Completed Hours</p>
                      <p className="text-lg font-semibold text-gray-900">{student.completedHours}</p>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      hasPendingApps && student.trainingStatus === "NOT_STARTED"
                        ? "bg-yellow-100 text-yellow-700"
                        : getStatusColor(student.trainingStatus)
                    }`}>
                      {hasPendingApps && student.trainingStatus === "NOT_STARTED"
                        ? "Waiting Approval"
                        : getStatusDisplayName(student.trainingStatus)
                      }
                    </span>
                    
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                {/* Applications preview */}
                {student.applications && student.applications.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {student.applications.length} application{student.applications.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center space-x-2">
                        {student.applications.map((app, index) => (
                          <span
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              app.status === "APPROVED" ? "bg-green-500" :
                              app.status === "REJECTED" ? "bg-red-500" :
                              "bg-yellow-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div
  className="fixed inset-0 flex items-center justify-center z-50 p-4"
  style={{ backgroundColor: "rgba(255,255,255,0)", backdropFilter: "none" }}
>

          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                    <p className="text-gray-600">ID: {selectedStudent.studentId} • {selectedStudent.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Student Info Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Training Status</p>
                      <p className={`font-semibold ${
                        selectedStudent.trainingStatus === "COMPLETED" ? "text-green-600" :
                        selectedStudent.trainingStatus === "IN_TRAINING" ? "text-blue-600" :
                        "text-gray-600"
                      }`}>
                        {getStatusDisplayName(selectedStudent.trainingStatus)}
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed Hours</p>
                      <p className="font-semibold text-gray-900">{selectedStudent.completedHours}</p>
                    </div>
                    <Clock className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Applications</p>
                      <p className="font-semibold text-gray-900">
                        {selectedStudent.applications ? selectedStudent.applications.length : 0}
                      </p>
                    </div>
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Applications */}
              {selectedStudent.applications && selectedStudent.applications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Approved Application & Reports</h3>
                  <div className="space-y-4">
                    {selectedStudent.applications
                    .filter(app => app.status === "APPROVED" && app.officialDocument)
                    .map((app, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{app.trainingPost.title}</h4>
                            <p className="text-sm text-gray-600">{app.trainingPost.company.name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === "APPROVED" ? "bg-green-100 text-green-700" :
                            app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {app.status === "UNDER_REVIEW" ? "Pending" : app.status.toLowerCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{app.trainingPost.duration} weeks</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{app.trainingPost.location}</span>
                          </div>
                        </div>
                        
                        {/* Reports for this application */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-3">Available Documents & Reports:</p>
                          <div className="flex flex-wrap gap-2">
                            {app.cv && (
                              <a
                                href={`https://railway-system-production-1a43.up.railway.app/${app.cv}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                CV
                              </a>
                            )}
                            {app.officialDocument && (
                              <a
                                href={`https://railway-system-production-1a43.up.railway.app/${app.officialDocument}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Official Document
                              </a>
                            )}
                            {app.finalReportByStudent && (
                              <a
                                href={`https://railway-system-production-1a43.up.railway.app/${app.finalReportByStudent}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Student Final Report
                              </a>
                            )}
                            {app.finalReportByCompany && (
                              <a
                                href={`https://railway-system-production-1a43.up.railway.app/${app.finalReportByCompany}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-md text-sm hover:bg-orange-200 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Company Final Report
                              </a>
                            )}
                            {app.activityReports && app.activityReports.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {app.activityReports.map((report, reportIndex) => (
                                  <a
                                    key={reportIndex}
                                    href={`https://railway-system-production-1a43.up.railway.app/${report}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 rounded-md text-sm hover:bg-teal-200 transition-colors"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Activity Report {reportIndex + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          {(!app.cv && !app.officialDocument && !app.finalReportByStudent && !app.finalReportByCompany && (!app.activityReports || app.activityReports.length === 0)) && (
                            <p className="text-sm text-gray-500 italic">No documents available yet</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(!selectedStudent.applications || selectedStudent.applications.filter(app => app.status === "APPROVED" && app.officialDocument).length === 0) && (
               <div className="text-center py-8">
               <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
               <p className="text-gray-600">No official approved applications for this student</p>
               </div>
               )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllStudent;