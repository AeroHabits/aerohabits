
import { motion } from "framer-motion";

export function AnimatedUnderline() {
  return (
    <motion.div 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: "220px", opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeInOut" }}
      className="relative h-1 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-blue-400/30 via-indigo-400/60 to-purple-400/30"
    >
      {/* Enhanced shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
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
