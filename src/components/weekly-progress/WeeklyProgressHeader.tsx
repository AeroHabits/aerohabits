
import { motion } from "framer-motion";
import { BarChart3, Trophy } from "lucide-react";

interface WeeklyProgressHeaderProps {
  weeklyPercentage: number;
}

export function WeeklyProgressHeader({ weeklyPercentage }: WeeklyProgressHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <BarChart3 className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
            Weekly Progress
          </span>
        </h2>
        <p className="text-sm text-white/80">
          Current Week Overview
        </p>
      </div>
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
        <motion.span 
          className="text-sm font-medium text-white flex items-center gap-1"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-lg text-gradient bg-gradient-to-r from-yellow-200 to-amber-400">{weeklyPercentage}%</span> 
          <span className="text-white/80">Overall Success</span>
        </motion.span>
      </div>
    </div>
  );
}
