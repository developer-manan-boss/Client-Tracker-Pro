import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: number | string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, translateY: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-[#1e293b] rounded-md flex flex-col items-center justify-center py-4 px-2 min-w-[120px] flex-1 shadow-lg border border-slate-700/50 cursor-default"
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-3xl font-light text-white mb-1"
      >
        {value}
      </motion.div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400 text-center font-semibold">
        {label}
      </div>
    </motion.div>
  );
};

export const SalesRepCard: React.FC = () => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-[#1e293b] rounded-md flex flex-col items-center justify-center py-4 px-2 min-w-[150px] flex-1 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
    >
        <div className="text-lg font-medium text-white mb-0">Emily Reyes</div>
        <div className="text-[10px] uppercase tracking-wider text-slate-400 text-center font-semibold">
            Most Active Sales Rep
        </div>
    </motion.div>
  )
}