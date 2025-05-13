import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

import Student from "./pages/auth/Student";
import Company from "./pages/auth/Company";
import Verify from "./pages/auth/Verify";
import AboutPage from "./pages/About";
import RegisterCompany from "./pages/auth/RegisterCompany";
import Department from "./pages/auth/Department";
import ResetPassword from "./pages/auth/ResetPassword";
import StudentDashBoard from "./pages/StudentDashBoard";
import CompanyDashBoard from "./pages/CompanyDashBoard";
import DepartmentDashBoard from "./pages/DepartmentDashBoard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/student" element={<Student />} />
            <Route path="/login/company" element={<Company />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard/student" element={<StudentDashBoard />} />
            <Route path="/dashboard/comapny" element={<CompanyDashBoard />} />
            <Route
              path="/dashboard/department"
              element={<DepartmentDashBoard />}
            />
            <Route path="/register/company" element={<RegisterCompany />} />
            <Route path="/login/department-head" element={<Department />} />
            <Route
              path="/auth/resetpassword/:token"
              element={<ResetPassword />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
