
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
        {/* Dynamic colorful background */}
        <motion.div 
          className="absolute -inset-1 rounded-lg blur-2xl bg-gradient-to-r from-cyan-500/40 via-blue-600/30 to-teal-400/40 opacity-90 transition duration-700"
          animate={{
            background: [
              "linear-gradient(to right, rgba(6, 182, 212, 0.4), rgba(37, 99, 235, 0.3), rgba(45, 212, 191, 0.4))",
              "linear-gradient(to right, rgba(45, 212, 191, 0.4), rgba(6, 182, 212, 0.4), rgba(37, 99, 235, 0.3))",
              "linear-gradient(to right, rgba(37, 99, 235, 0.3), rgba(45, 212, 191, 0.4), rgba(6, 182, 212, 0.4))"
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
          <span className="absolute -top-0.5 -left-0.5 text-cyan-500/30">
            AEROHABITS
          </span>
          
          {/* Main text with animated gradient and glow */}
          <motion.span 
            className="text-white relative inline-block"
            animate={{ 
              textShadow: [
                "0 0 8px rgba(255, 255, 255, 0.4)",
                "0 0 16px rgba(20, 184, 166, 0.6)",
                "0 0 8px rgba(255, 255, 255, 0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AEROHABITS
          </motion.span>
          
          {/* Animated colorful underline effect */}
          <motion.span
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400"
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
