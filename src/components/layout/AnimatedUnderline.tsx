
import { motion } from "framer-motion";

export function AnimatedUnderline() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "180px", opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      className="relative h-0.5 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
    >
      {/* Subtle shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
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
