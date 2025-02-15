
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400/90 to-orange-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="relative">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <Trophy className="h-4 w-4 text-white" />
          </motion.div>
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Star className="h-4 w-4 absolute -top-2 -right-2 text-yellow-200 animate-pulse" />
            <Sparkles className="h-3 w-3 absolute -bottom-1 -left-1 text-yellow-200 animate-pulse" />
          </motion.div>
        </div>
        
        <motion.div 
          className="flex items-center gap-1"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="font-bold text-sm text-white tracking-wide">
            {points}
          </span>
          <span className="text-xs text-white/90 font-medium">
            pts
          </span>
        </motion.div>
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-amber-400/20 rounded-full blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
