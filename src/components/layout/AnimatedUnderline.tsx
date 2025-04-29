
import { motion } from "framer-motion";

export function AnimatedUnderline() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "160px", opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      className="relative h-px mx-auto rounded-full overflow-hidden"
    >
      {/* Elegant minimal underline */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      
      {/* Subtle shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
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
