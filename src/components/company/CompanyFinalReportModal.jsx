import React, { useState } from 'react';
import { Check, Send, Download } from 'lucide-react';

const CompanyFinalReport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const student = "Student Placeholder";
  const trainingTitle = "Training Title Placeholder";

  const templateUrl = '/templates/company_evaluation_form.pdf';


  const handleDownloadTemplate = () => {
    window.open(templateUrl, '_blank');
  };

  const handleSubmit = () => {
    setIsUploading(true);
    setTimeout(() => {
      // simulate submit logic
      console.log("Submitted report:", {
        studentName: student,
        trainingTitle,
        reportFile: 'company_evaluation_form.pdf',
        submissionDate: new Date().toISOString().split('T')[0],
      });
      setIsUploading(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 1500);
    }, 800);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit Final Training Report</h2>

      <div className="mb-4 bg-gray-50 p-4 rounded-md">
        <p className="text-gray-600">Student: <span className="font-medium text-gray-800">{student}</span></p>
        <p className="text-gray-600">Training: <span className="font-medium text-gray-800">{trainingTitle}</span></p>
        <p className="text-gray-600">Report Date: <span className="font-medium text-gray-800">{new Date().toISOString().split('T')[0]}</span></p>
      </div>

      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center my-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-2">Report Submitted Successfully!</h3>
          <p className="text-green-700">
            Thank you for submitting the student evaluation report. The report has been sent to the system.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700">
              ⚠️ <strong>Note:</strong> The actual student training period is <strong>8 weeks</strong> during regular semesters and <strong>6 weeks</strong> during the summer semester.
            </p>
            
          </div>

          <div className="mb-6 text-center">
            <button 
              onClick={handleDownloadTemplate} 
              className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 mx-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Evaluation Form Template
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <div className="bg-gray-200 p-2 flex justify-between items-center">
                <span className="text-sm text-gray-700">PDF Preview</span>
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
                  data="/templates/company_evaluation_form.pdf#toolbar=0" 
                  type="application/pdf" 
                  width="100%" 
                  height="100%" 
                  className="w-full h-full"
                >
                  <p>Your browser does not support viewing PDFs. <a href={templateUrl} download>Download the PDF</a> instead.</p>
                </object>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className={`bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyFinalReport;
