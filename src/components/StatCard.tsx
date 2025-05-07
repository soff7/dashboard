
import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend = 0, index }) => {
  return (
    <motion.div 
      className="mtps-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          
          {trend !== 0 && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% depuis le mois dernier
            </p>
          )}
        </div>
        
        <div className="bg-mtps-blue/10 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
