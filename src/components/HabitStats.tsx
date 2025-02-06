
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
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-[#1A1F2C]/80 to-[#403E43]/80 backdrop-blur-sm border-[#8E9196]/20 hover:shadow-lg transition-all">
          <Trophy className="h-10 w-10 text-[#FFD700]" />
          <div>
            <h3 className="font-semibold text-[#C8C8C9]">Total Habits</h3>
            <p className="text-2xl font-bold text-white">{totalHabits}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-[#1A1F2C]/80 to-[#403E43]/80 backdrop-blur-sm border-[#8E9196]/20 hover:shadow-lg transition-all">
          <Flame className="h-10 w-10 text-[#9F9EA1]" />
          <div>
            <h3 className="font-semibold text-[#C8C8C9]">Total Streaks</h3>
            <p className="text-2xl font-bold text-white">{totalStreaks}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-[#1A1F2C]/80 to-[#403E43]/80 backdrop-blur-sm border-[#8E9196]/20 hover:shadow-lg transition-all">
          <Target className="h-10 w-10 text-[#9F9EA1]" />
          <div>
            <h3 className="font-semibold text-[#C8C8C9]">Completed Today</h3>
            <p className="text-2xl font-bold text-white">{completedToday}</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

