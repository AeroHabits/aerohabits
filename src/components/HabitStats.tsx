
import { Card } from "@/components/ui/card";
import { Trophy, Target, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface HabitStatsProps {
  totalHabits: number;
  totalStreaks: number;
  completedToday: number;
}

export function HabitStats({ totalHabits, totalStreaks, completedToday }: HabitStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-500/30 hover:bg-purple-500/30 transition-all">
          <Trophy className="h-10 w-10 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Total Habits</h3>
            <p className="text-2xl font-bold text-white">{totalHabits}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border-blue-500/30 hover:bg-blue-500/30 transition-all">
          <Flame className="h-10 w-10 text-orange-400" />
          <div>
            <h3 className="font-semibold text-white">Total Streaks</h3>
            <p className="text-2xl font-bold text-white">{totalStreaks}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-500/30 hover:bg-green-500/30 transition-all">
          <Target className="h-10 w-10 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-white">Completed Today</h3>
            <p className="text-2xl font-bold text-white">{completedToday}</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
