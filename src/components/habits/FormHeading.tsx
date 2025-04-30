
import React from "react";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

export const FormHeading: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          type: "spring",
          stiffness: 200
        }} 
        className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg"
      >
        <Dumbbell className="w-6 h-6 text-white" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-white"
      >
        Create Custom Habits
      </motion.div>
    </div>
  );
};
