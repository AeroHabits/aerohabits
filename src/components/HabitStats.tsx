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
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:shadow-lg transition-all">
          <Trophy className="h-10 w-10 text-yellow-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Total Habits</h3>
            <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 hover:shadow-lg transition-all">
          <Flame className="h-10 w-10 text-orange-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Total Streaks</h3>
            <p className="text-2xl font-bold text-gray-900">{totalStreaks}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 hover:shadow-lg transition-all">
          <Target className="h-10 w-10 text-green-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Completed Today</h3>
            <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}