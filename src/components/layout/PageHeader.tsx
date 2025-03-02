
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

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
      <div className="relative flex items-center justify-center group">
        {/* Animated background glow */}
        <motion.div 
          className="absolute -inset-1 rounded-lg blur-xl bg-gradient-to-r from-blue-400/20 via-indigo-500/20 to-purple-500/20 opacity-50 group-hover:opacity-75 transition duration-700"
          animate={{
            background: [
              "linear-gradient(to right, rgba(96, 165, 250, 0.2), rgba(129, 140, 248, 0.2), rgba(168, 85, 247, 0.2))",
              "linear-gradient(to right, rgba(129, 140, 248, 0.2), rgba(168, 85, 247, 0.2), rgba(96, 165, 250, 0.2))",
              "linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(96, 165, 250, 0.2), rgba(129, 140, 248, 0.2))"
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* Sparkles on either side */}
        <motion.div
          className="absolute -left-3 -top-1"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Sparkles className="h-4 w-4 text-blue-300" />
        </motion.div>
        
        <motion.div
          className="absolute -right-3 -bottom-1"
          animate={{
            rotate: [0, -15, 15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        >
          <Star className="h-4 w-4 text-indigo-300" />
        </motion.div>
        
        {/* AEROHABITS text with enhanced styling */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight relative">
          {/* 3D effect layer */}
          <span className="absolute -top-0.5 -left-0.5 text-black/10">
            AEROHABITS
          </span>
          
          {/* Main text with gradient */}
          <span className="bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-300 bg-clip-text text-transparent drop-shadow-sm">
            AEROHABITS
          </span>
        </h1>
      </div>
    </motion.div>
  );
}
