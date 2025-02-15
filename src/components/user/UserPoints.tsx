
import { Trophy, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface UserPointsProps {
  points: number;
}

export function UserPoints({ points }: UserPointsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <motion.div 
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-400/90 to-blue-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="relative">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <Trophy className="h-3.5 w-3.5 text-white" />
          </motion.div>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Star className="h-3 w-3 absolute -top-1.5 -right-1.5 text-blue-200 animate-pulse" />
            <Sparkles className="h-2.5 w-2.5 absolute -bottom-1 -left-1 text-blue-200 animate-pulse" />
          </motion.div>
        </div>
        
        <motion.div 
          className="flex items-center gap-0.5"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="font-bold text-xs text-white tracking-wide">
            {points}
          </span>
          <span className="text-[10px] text-white/90 font-medium">
            pts
          </span>
        </motion.div>
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-indigo-400/20 rounded-full blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
