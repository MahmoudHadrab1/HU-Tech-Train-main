/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Import your images
import studentJourneyImg from "../../../assets/images/student_img2.png";
import companyImg1 from "../../../assets/images/company_img1.png";

const WelcomeSection = () => {
  const [activeSection, setActiveSection] = useState("student");
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Optimized animation variants with faster transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
        duration: 0.3,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20, 
        duration: 0.4,
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.4,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.3
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      }
    },
    hover: {
      scale: 1.02,
      y: -3,
      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.2)",
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.2,
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 150,
        damping: 15, 
      }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      y: -1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 15,
        duration: 0.2,
      }
    },
    tap: { 
      scale: 0.97,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 20,
        duration: 0.1,
      }
    }
  };

  // Optimized content transition props
  const contentTransitionProps = {
    type: "tween",
    duration: 0.3,
    ease: "easeOut" 
  };

  return (
    <div className="relative overflow-hidden bg-gray-50 py-16">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gray-50"></div>
        <div className="absolute top-0 right-0 w-full h-96 bg-red-50 transform -skew-y-6 -translate-y-24"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gray-50"></div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="1" fill-rule="evenodd"%3E%3Ccircle cx="20" cy="20" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="mb-10"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4 tracking-tight"
            variants={headingVariants}
          >
            Welcome to <span className="text-red-600">HU-Tech Train</span>
          </motion.h1>

          <motion.div
            className="w-20 h-1 bg-red-600 mx-auto mt-2 mb-6"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 80, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          />
        </motion.div>

        {/* Section Switcher */}
        <motion.div 
          className="flex justify-center mb-10"
          variants={itemVariants}
        >
          <div className="inline-flex bg-gray-200 rounded-full p-1.5 shadow-md">
            <motion.button 
              className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                activeSection === "student" 
                  ? "bg-red-600 text-white shadow-md" 
                  : "text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("student")}
              whileHover={{ scale: activeSection === "student" ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17, duration: 0.2 }}
            >
              For Students
            </motion.button>
            <motion.button 
              className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                activeSection === "company" 
                  ? "bg-red-600 text-white shadow-md" 
                  : "text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveSection("company")}
              whileHover={{ scale: activeSection === "company" ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17, duration: 0.2 }}
            >
              For Companies
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeSection === "student" && (
            <motion.div 
              key="student-section"
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={contentTransitionProps}
            >
              {/* Left content - Image (made smaller) */}
              <motion.div 
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="max-w-md mx-auto lg:mx-0" // Added max-width and centering
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={studentJourneyImg}
                    alt="Student journey illustration"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>

              {/* Right content - Text */}
              <motion.div 
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    <span className="text-red-600">Your Journey To A</span> <span className="text-gray-800">Brighter Future</span>
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-bold text-red-600">
                    Starts With The Right Internship
                  </h3>
                </motion.div>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-gray-700 text-lg leading-relaxed font-medium" // Adjusted font-weight for clarity
                >
                  Your career journey begins with the right skills and the right guidance. 
                  Through our training program, you will receive the training you need in the 
                  right place, with the best companies ensuring you're ready for the professional world.
                </motion.p>

                <motion.div 
                  variants={itemVariants}
                  className="pt-2"
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="inline-block" // Added to ensure proper sizing
                  >
                    <Link
                      to="/login/student"
                      className="bg-red-600 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center shadow-md"
                    >
                      Start Your Journey
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {activeSection === "company" && (
            <motion.div 
              key="company-section"
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={contentTransitionProps}
            >
              {/* Left content - Text */}
              <motion.div 
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    <span className="text-red-600">Connect, collaborate, and grow</span>
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                    with the next generation of industry leaders
                  </h3>
                </motion.div>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-gray-700 text-lg leading-relaxed font-medium" // Adjusted font-weight for clarity
                >
                  Invest in the future of your industry with our training program, which
                  helps you connect with and train our students. You will find the right
                  students tailored to your company's needs, ensuring a perfect match
                  for your organization's growth and success.
                </motion.p>

                <motion.div 
                  variants={itemVariants}
                  className="pt-2"
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="inline-block" // Added to ensure proper sizing
                  >
                    <Link
                      to="/verify"
                      className="bg-red-600 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center shadow-md"
                    >
                      Register Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right content - Image (made smaller) */}
              <motion.div 
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="max-w-md mx-auto lg:mx-0 lg:ml-auto" // Added max-width and centering
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={companyImg1}
                    alt="Company illustration"
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WelcomeSection;