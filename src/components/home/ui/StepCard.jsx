/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const StepCard = ({ number, image, title, description }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 relative"
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <motion.div 
        className="absolute -top-4 -left-4 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          delay: 0.1 
        }}
      >
        {number}
      </motion.div>
      <motion.div 
        className="mb-4"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={image}
          alt={`${title} illustration`}
          className="w-full h-40 object-contain"
        />
      </motion.div>
      <motion.h3 
        className="text-lg font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default StepCard;