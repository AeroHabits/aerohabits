
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
        {/* Enhanced background effect */}
        <motion.div 
          className="absolute -inset-1 rounded-lg blur-xl bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-blue-700/30 opacity-80 transition duration-700"
          animate={{
            background: [
              "linear-gradient(to right, rgba(37, 99, 235, 0.3), rgba(79, 70, 229, 0.2), rgba(37, 99, 235, 0.3))",
              "linear-gradient(to right, rgba(79, 70, 229, 0.2), rgba(37, 99, 235, 0.3), rgba(79, 70, 229, 0.2))",
              "linear-gradient(to right, rgba(37, 99, 235, 0.3), rgba(79, 70, 229, 0.2), rgba(37, 99, 235, 0.3))"
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* AEROHABITS text with exciting styling */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight relative">
          {/* Text shadow for depth */}
          <span className="absolute -top-0.5 -left-0.5 text-blue-500/20">
            AEROHABITS
          </span>
          
          {/* Main text with animated gradient */}
          <motion.span 
            className="text-white relative inline-block"
            animate={{ 
              textShadow: [
                "0 0 8px rgba(255, 255, 255, 0.4)",
                "0 0 16px rgba(255, 255, 255, 0.6)",
                "0 0 8px rgba(255, 255, 255, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AEROHABITS
          </motion.span>
          
          {/* Subtle animated underline effect */}
          <motion.span
            className="absolute -bottom-1 left-0 h-0.5 bg-blue-400"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
        </h1>
      </div>
    </motion.div>
  );
}
