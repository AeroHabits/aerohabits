
import { Trophy } from "lucide-react";
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
      className="flex items-center gap-1 md:gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Trophy className="h-3 w-3 md:h-4 md:w-4 text-white" />
      </motion.div>
      <motion.span 
        className="font-bold text-xs md:text-sm text-white"
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {points} pts
      </motion.span>
    </motion.div>
  );
}
