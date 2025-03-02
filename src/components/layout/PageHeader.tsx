
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
        {/* Enhanced white background with subtle color gradient */}
        <motion.div 
          className="absolute -inset-1 rounded-lg blur-2xl bg-gradient-to-r from-white/80 via-cyan-500/30 to-white/80 opacity-90 transition duration-700"
          animate={{
            background: [
              "linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(6, 182, 212, 0.3), rgba(255, 255, 255, 0.8))",
              "linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8), rgba(6, 182, 212, 0.3))",
              "linear-gradient(to right, rgba(6, 182, 212, 0.3), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8))"
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* AEROHABITS text with bold white styling */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight relative">
          {/* Text shadow for depth */}
          <span className="absolute -top-0.5 -left-0.5 text-white/30">
            AEROHABITS
          </span>
          
          {/* Main text with white glow */}
          <motion.span 
            className="text-white relative inline-block"
            animate={{ 
              textShadow: [
                "0 0 8px rgba(255, 255, 255, 0.7)",
                "0 0 16px rgba(255, 255, 255, 0.9)",
                "0 0 8px rgba(255, 255, 255, 0.7)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AEROHABITS
          </motion.span>
          
          {/* Removed the animated colorful underline effect */}
        </h1>
      </div>
    </motion.div>
  );
}
