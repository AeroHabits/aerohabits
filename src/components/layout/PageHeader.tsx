
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
        {/* Subtle elegant background effect */}
        <motion.div 
          className="absolute -inset-1 rounded-lg blur-xl bg-gradient-to-r from-slate-600/20 via-indigo-600/15 to-slate-700/20 opacity-70 transition duration-700"
          animate={{
            background: [
              "linear-gradient(to right, rgba(71, 85, 105, 0.2), rgba(79, 70, 229, 0.15), rgba(51, 65, 85, 0.2))",
              "linear-gradient(to right, rgba(79, 70, 229, 0.15), rgba(51, 65, 85, 0.2), rgba(71, 85, 105, 0.2))",
              "linear-gradient(to right, rgba(51, 65, 85, 0.2), rgba(71, 85, 105, 0.2), rgba(79, 70, 229, 0.15))"
            ]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* AEROHABITS text with sophisticated styling */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight relative">
          {/* Subtle depth effect */}
          <span className="absolute -top-0.5 -left-0.5 text-black/10">
            AEROHABITS
          </span>
          
          {/* Main text with refined gradient */}
          <span className="bg-gradient-to-r from-gray-100 via-slate-200 to-indigo-100 bg-clip-text text-transparent">
            AEROHABITS
          </span>
        </h1>
      </div>
    </motion.div>
  );
}
