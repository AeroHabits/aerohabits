
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroTitle() {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
    >
      <div className="relative inline-block">
        {/* Enhanced background glow effect */}
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500/20 via-purple-500/30 to-blue-500/20 blur-xl"></div>
        
        {/* Main title */}
        <h2 className="relative text-3xl md:text-5xl font-bold tracking-tight">
          <div className="flex items-center justify-center gap-2">
            <span className="bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-200 bg-clip-text text-transparent drop-shadow-sm">
              Journey To Self-Mastery
            </span>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
            >
              <Sparkles className="h-6 w-6 text-indigo-400/90" />
            </motion.div>
          </div>
        </h2>
      </div>
    </motion.div>
  );
}
