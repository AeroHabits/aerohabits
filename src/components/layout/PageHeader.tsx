
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
          className="absolute -inset-1 rounded-lg blur-xl bg-gradient-to-r from-purple-500/30 via-indigo-600/30 to-blue-500/30 opacity-60 group-hover:opacity-85 transition duration-700"
          animate={{
            background: [
              "linear-gradient(to right, rgba(155, 135, 245, 0.3), rgba(217, 70, 239, 0.3), rgba(14, 165, 233, 0.3))",
              "linear-gradient(to right, rgba(217, 70, 239, 0.3), rgba(14, 165, 233, 0.3), rgba(155, 135, 245, 0.3))",
              "linear-gradient(to right, rgba(14, 165, 233, 0.3), rgba(155, 135, 245, 0.3), rgba(217, 70, 239, 0.3))"
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
          <Sparkles className="h-4 w-4 text-pink-400" />
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
          <Star className="h-4 w-4 text-amber-300" />
        </motion.div>
        
        {/* AEROHABITS text with enhanced styling */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight relative">
          {/* 3D effect layer */}
          <span className="absolute -top-0.5 -left-0.5 text-black/15">
            AEROHABITS
          </span>
          
          {/* Main text with gradient */}
          <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-sky-400 bg-clip-text text-transparent drop-shadow-sm">
            AEROHABITS
          </span>
        </h1>
      </div>
    </motion.div>
  );
}
