
import { motion } from "framer-motion";

export function AnimatedUnderline() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "240px", opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      className="relative h-[1px] mx-auto rounded-full overflow-hidden"
    >
      {/* Subtle gradient base for underline */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 via-blue-400/30 to-gray-400/20"></div>
      
      {/* Subtle shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ 
          x: ["100%", "-100%"], 
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "loop", 
          duration: 2, 
          ease: "easeInOut" 
        }}
      />
    </motion.div>
  );
}
