
import React from 'react';
import { motion } from 'framer-motion';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, className = '' }) => {
  return (
    <motion.div 
      className={`mtps-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
      <div className="mt-2">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartContainer;
