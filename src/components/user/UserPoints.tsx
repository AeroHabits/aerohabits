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
      className="flex items-center gap-2 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Trophy className="h-5 w-5 text-amber-600" />
      </motion.div>
      <motion.span 
        className="font-semibold text-amber-900"
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {points} pts
      </motion.span>
    </motion.div>
  );
}