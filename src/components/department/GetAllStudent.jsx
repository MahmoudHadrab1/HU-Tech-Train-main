import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertCircle } from "lucide-react";

const GetAllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
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

        setStudents(response.data.data.students);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 my-10 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Department Students
      </h2>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-lg">No students found.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {students.map((student) => (
            <li
              key={student._id}
              className="p-5 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
            >
              <p className="text-lg font-semibold text-gray-800">
                {student.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Student ID:</strong> {student.studentId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Department:</strong> {student.department}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Completed Hours:</strong> {student.completedHours}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Training Status:</strong> {student.trainingStatus}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetAllStudent;
