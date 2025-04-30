
import { motion } from "framer-motion";

export function AnimatedUnderline() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "180px", opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      className="relative h-0.5 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-blue-400/20 via-indigo-400/40 to-purple-400/20"
    >
      {/* Enhanced subtle shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
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
