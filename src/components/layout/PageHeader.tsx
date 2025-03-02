
import { motion } from "framer-motion";

export function PageHeader() {
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: -20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.3
      }} 
      className="mb-8"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle professional background with minimal gradient */}
        <motion.div 
          className="absolute -inset-1 rounded-lg blur-lg bg-gradient-to-r from-gray-100/80 via-gray-200/30 to-gray-100/80 opacity-70"
          animate={{
            background: [
              "linear-gradient(to right, rgba(243, 244, 246, 0.8), rgba(209, 213, 219, 0.3), rgba(243, 244, 246, 0.8))",
              "linear-gradient(to right, rgba(243, 244, 246, 0.8), rgba(243, 244, 246, 0.8), rgba(209, 213, 219, 0.3))",
              "linear-gradient(to right, rgba(209, 213, 219, 0.3), rgba(243, 244, 246, 0.8), rgba(243, 244, 246, 0.8))"
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* AEROHABITS text with professional styling */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight relative">
          {/* Subtle shadow for depth */}
          <span className="absolute -top-0.5 -left-0.5 text-gray-200/30">
            AEROHABITS
          </span>
          
          {/* Main text with refined styling */}
          <motion.span 
            className="text-gray-800 relative inline-block"
          >
            AEROHABITS
          </motion.span>
        </h1>
      </div>
    </motion.div>
  );
}
