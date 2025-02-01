import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface UserPointsProps {
  points: number;
}

export function UserPoints({ points }: UserPointsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-200 px-3 py-1.5 rounded-full"
    >
      <Trophy className="h-4 w-4 text-amber-600" />
      <span className="font-medium text-amber-900">
        {points} pts
      </span>
    </motion.div>
  );
}