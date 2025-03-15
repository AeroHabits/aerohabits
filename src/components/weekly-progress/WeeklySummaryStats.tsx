
import { motion } from "framer-motion";
import { Check, Trophy, Sparkles } from "lucide-react";

interface WeeklySummaryStatsProps {
  totalCompleted: number;
  totalHabits: number;
}

export function WeeklySummaryStats({ totalCompleted, totalHabits }: WeeklySummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div 
        className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-lg p-4 border border-white/10"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm text-white/80 font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          Completed Tasks
        </p>
        <motion.p 
          className="text-3xl font-bold text-white flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {totalCompleted}
          {totalCompleted > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </motion.span>
          )}
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg p-4 border border-white/10"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm text-white/80 font-medium flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Total Tasks
        </p>
        <motion.p 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {totalHabits}
        </motion.p>
      </motion.div>
    </div>
  );
}
