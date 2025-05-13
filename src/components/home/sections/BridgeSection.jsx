/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import RoleCard from "../ui/RoleCard";
import studentsBenefit from "../../../assets/images/students_benefit.jpg";
import companiesBenefit from "../../../assets/images/companies_benefit.jpg";
import departmentHead from "../../../assets/images/department_head.jpg";

const BridgeSection = () => {
  // Custom color to match WelcomeSection
  const customRedColor = "#ed4444";
  const backgroundTint = "#f0f4f8"; // Subtle light gray-blue background

  // Improved animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  return (
    <div className="py-20" style={{ background: "linear-gradient(to bottom, #f7fafd, #eef2f7)" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header with improved styling */}
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              That rewarding feeling of building a bridge between education and the professional world?
            </motion.h2>
            
            <motion.div 
              className="inline-flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: customRedColor }}>
                It's mutual
              </h3>
              <div className="w-16 h-1 mb-6" style={{ backgroundColor: customRedColor }}></div>
            </motion.div>
            
            <motion.p 
              className="text-gray-700 text-lg max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              When university students connect with companies through structured training programs,
              everyone benefits. Students gain experience, companies find talent, and academic departments
              ensure quality.
            </motion.p>
          </div>

          {/* Three Columns with improved cards layout */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <RoleCard 
                image={studentsBenefit}
                title="Students"
                description="Gain valuable practical experience through internships, enhancing their skills and employability."
                iconColor={customRedColor}
                hoverEffect={true}
              />
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <RoleCard 
                image={companiesBenefit}
                title="Companies"
                description="Access a pool of talented students, helping you find skilled interns who can contribute to your projects and company growth."
                iconColor={customRedColor}
                hoverEffect={true}
              />
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <RoleCard 
                image={departmentHead}
                title="Department Heads"
                description="Ensure students receive quality training and meet academic requirements while developing professional connections."
                iconColor={customRedColor}
                hoverEffect={true}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BridgeSection;