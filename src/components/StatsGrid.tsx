import { Card } from "@/components/ui/card";
import { Trophy, Flame, Target, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsGridProps {
  totalHabits: number;
  currentStreak: number;
  completionRate: number;
  weeklyProgress: number;
  monthlyAverage: number;
  bestStreak: number;
}

export function StatsGrid({
  totalHabits,
  currentStreak,
  completionRate,
  weeklyProgress,
  monthlyAverage,
  bestStreak
}: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
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
        <Card className="p-6 flex items-center space-x-4 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
          <Flame className="h-10 w-10 text-orange-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Current Streak</h3>
            <p className="text-2xl font-bold text-gray-900">{currentStreak} days</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
          <Target className="h-10 w-10 text-purple-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Completion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
          <Calendar className="h-10 w-10 text-blue-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Weekly Progress</h3>
            <p className="text-2xl font-bold text-gray-900">{weeklyProgress}%</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Monthly Average</h3>
            <p className="text-2xl font-bold text-gray-900">{monthlyAverage}%</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="p-6 flex items-center space-x-4 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
          <TrendingUp className="h-10 w-10 text-cyan-500" />
          <div>
            <h3 className="font-semibold text-gray-700">Best Streak</h3>
            <p className="text-2xl font-bold text-gray-900">{bestStreak} days</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}