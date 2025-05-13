/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const RoleCard = ({ image, title, description }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div 
        className="mb-4 overflow-hidden rounded-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={image}
          alt={`${title} illustration`}
          className="rounded-lg w-full h-48 object-cover transform hover:scale-105 transition-transform duration-700"
        />
      </motion.div>
      <motion.h3 
        className="text-xl font-bold text-gray-800 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default RoleCard;