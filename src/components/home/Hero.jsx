/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import WelcomeSection from "./sections/WelcomeSection";
import BridgeSection from "./sections/BridgeSection";
import HowItWorksSection from "./sections/HowItWorksSection";

const Hero = () => {
  return (
    <motion.div 
      className="bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <WelcomeSection />
      <BridgeSection />
      <HowItWorksSection />
    </motion.div>
  );
};

export default Hero;