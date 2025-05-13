/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepCard from "../ui/StepCard";

// Student flow images
import howItWorksStudent1 from "../../../assets/images/how_it_works_student_1.png";
import howItWorksStudent2 from "../../../assets/images/how_it_works_student_2.png";
import howItWorksStudent3 from "../../../assets/images/how_it_works_student_3.png";
import howItWorksStudent4 from "../../../assets/images/how_it_works_student_4.png";

// Company flow images
import howItWorksCompany1 from "../../../assets/images/how_it_works_company_1.png";
import howItWorksCompany2 from "../../../assets/images/how_it_works_company_2.png";
import howItWorksCompany3 from "../../../assets/images/how_it_works_company_3.png";
import howItWorksCompany4 from "../../../assets/images/how_it_works_company_4.png";

const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState("students");
  
  // Custom colors to match other sections
  const customRedColor = "#ed4444";

  // Improved animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4
      } 
    }
  };

  return (
    <div id="how-it-works" className="py-20" style={{ background: "linear-gradient(to bottom, #f7fafd, #eef2f7)" }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.4 }}
          >
            How It Works
          </motion.h2>

          <motion.div
            className="w-16 h-1 mx-auto mb-6"
            style={{ backgroundColor: customRedColor }}
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />

          <motion.p
            className="text-gray-700 max-w-2xl mx-auto mb-10 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Our streamlined process helps connect students with companies through a simple, efficient workflow.
          </motion.p>
        </div>

        <motion.div 
          className="flex justify-center mb-14"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="inline-flex bg-gray-200 rounded-full p-1.5 shadow-sm">
            <motion.button 
              className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                activeTab === "students" 
                  ? "text-white shadow-sm" 
                  : "text-gray-700 hover:bg-gray-300"
              }`}
              style={{ backgroundColor: activeTab === "students" ? customRedColor : "" }}
              onClick={() => setActiveTab("students")}
              whileHover={{ scale: activeTab === "students" ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17, duration: 0.2 }}
            >
              For Students
            </motion.button>
            <motion.button 
              className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                activeTab === "companies" 
                  ? "text-white shadow-sm" 
                  : "text-gray-700 hover:bg-gray-300"
              }`}
              style={{ backgroundColor: activeTab === "companies" ? customRedColor : "" }}
              onClick={() => setActiveTab("companies")}
              whileHover={{ scale: activeTab === "companies" ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17, duration: 0.2 }}
            >
              For Companies
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "students" && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              key="students-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="1"
                  image={howItWorksStudent1}
                  title="Log in to your profile"
                  description="Logging in takes less than 1 minute. Just enter your ID and password to start exploring opportunities."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="2"
                  image={howItWorksStudent2}
                  title="Search for internship"
                  description="Look for available internship opportunities at various companies that match your skills and interests."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="3"
                  image={howItWorksStudent3}
                  title="Apply for the Internship"
                  description="Select the company you wish to intern with and submit your application with your CV and qualifications."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="4"
                  image={howItWorksStudent4}
                  title="Send a report at the end"
                  description="Send a report or documentation to the department head to document your experience and learning outcomes."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
            </motion.div>
          )}

          {activeTab === "companies" && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              key="companies-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="1"
                  image={howItWorksCompany1}
                  title="Register your company"
                  description="Create an account for your company with your business details and verify your identity to join our network."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="2"
                  image={howItWorksCompany2}
                  title="Post training opportunities"
                  description="Create detailed listings of available internship positions at your company, including skills required and duration."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="3"
                  image={howItWorksCompany3}
                  title="Review applications"
                  description="Browse student applications, review their qualifications, and select candidates that best match your needs."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <StepCard 
                  number="4"
                  image={howItWorksCompany4}
                  title="Provide feedback"
                  description="Submit evaluation reports about student performance to help improve the program and recognize talent."
                  accentColor={customRedColor}
                  shadow="lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HowItWorksSection;