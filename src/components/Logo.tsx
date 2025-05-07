
import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span 
        className="text-mtps-blue text-2xl font-bold"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        mtps
      </motion.span>
      <span className="text-gray-400 text-sm ml-2">Manufacture de Tubes Plastiques et Services</span>
    </motion.div>
  );
};

export default Logo;
