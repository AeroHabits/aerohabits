
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
        <Card className="p-6 flex items-center space-x-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
          <Trophy className="h-10 w-10 text-gray-300" />
          <div>
            <h3 className="font-semibold text-gray-300">Total Habits</h3>
            <p className="text-2xl font-bold text-white">{totalHabits}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
          <Flame className="h-10 w-10 text-gray-300" />
          <div>
            <h3 className="font-semibold text-gray-300">Total Streaks</h3>
            <p className="text-2xl font-bold text-white">{totalStreaks}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
          <Target className="h-10 w-10 text-gray-300" />
          <div>
            <h3 className="font-semibold text-gray-300">Completed Today</h3>
            <p className="text-2xl font-bold text-white">{completedToday}</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
