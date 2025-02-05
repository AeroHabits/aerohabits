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
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30 hover:shadow-lg transition-all backdrop-blur-sm">
          <Trophy className="h-10 w-10 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white/80">Total Habits</h3>
            <p className="text-2xl font-bold text-white">{totalHabits}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/30 hover:shadow-lg transition-all backdrop-blur-sm">
          <Flame className="h-10 w-10 text-orange-400" />
          <div>
            <h3 className="font-semibold text-white/80">Total Streaks</h3>
            <p className="text-2xl font-bold text-white">{totalStreaks}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border-fuchsia-500/30 hover:shadow-lg transition-all backdrop-blur-sm">
          <Target className="h-10 w-10 text-purple-400" />
          <div>
            <h3 className="font-semibold text-white/80">Completed Today</h3>
            <p className="text-2xl font-bold text-white">{completedToday}</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}