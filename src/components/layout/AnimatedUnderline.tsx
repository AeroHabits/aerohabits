
import { motion } from "framer-motion";

export function AnimatedUnderline() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "280px", opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
      className="relative h-[2px] mx-auto rounded-full overflow-hidden"
    >
      {/* Gradient base for underline */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400 to-purple-400/10"></div>
      
      {/* Animated shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{ 
          x: ["100%", "-100%"], 
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "loop", 
          duration: 3, 
          ease: "easeInOut" 
        }}
      />
    </motion.div>
  );
}
