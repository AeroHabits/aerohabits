
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Target, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StatsGridProps {
  totalHabits: number;
  currentStreak: number;
  completionRate: number;
  weeklyProgress: number;
  monthlyAverage: number;
  bestStreak: number;
}

interface StatCardProps {
  icon: React.ReactElement;
  title: string;
  value: string | number;
  description: string;
  delay: number;
  gradientFrom: string;
  gradientTo: string;
}

const StatCard = ({ icon, title, value, description, delay, gradientFrom, gradientTo }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Dialog>
      <DialogTrigger asChild>
        <Card className={`p-6 bg-gradient-to-br from-${gradientFrom}/10 to-${gradientTo}/5 hover:from-${gradientFrom}/20 hover:to-${gradientTo}/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br from-${gradientFrom} to-${gradientTo} shadow-md`}>
              {icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-white/80 text-sm uppercase tracking-wide">{title}</h3>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/60 line-clamp-1">{description}</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white font-bold text-xl flex items-center gap-2">
            <span className={`p-2 rounded-lg bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`}>
              {icon}
            </span>
            {title}
          </DialogTitle>
          <DialogDescription className="text-white/80">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-5xl font-bold text-center text-white">{value}</p>
          <p className="text-center text-white/60 text-sm mt-2">Current Value</p>
        </div>
      </DialogContent>
    </Dialog>
  </motion.div>
);

export function StatsGrid({
  totalHabits,
  currentStreak,
  completionRate,
  weeklyProgress,
  monthlyAverage,
  bestStreak
}: StatsGridProps) {
  const stats = [
    {
      icon: <Trophy className="h-6 w-6 text-white" />,
      title: "Total Habits",
      value: totalHabits,
      description: "The total number of habits you're currently tracking",
      delay: 0,
      gradientFrom: "amber-500",
      gradientTo: "amber-600"
    },
    {
      icon: <Flame className="h-6 w-6 text-white" />,
      title: "Current Streak",
      value: `${currentStreak} Days`,
      description: "Your ongoing streak of consistently maintaining habits",
      delay: 0.1,
      gradientFrom: "rose-500",
      gradientTo: "red-600"
    },
    {
      icon: <Target className="h-6 w-6 text-white" />,
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Your overall success rate in completing your habits",
      delay: 0.2,
      gradientFrom: "sky-500",
      gradientTo: "blue-600"
    },
    {
      icon: <Calendar className="h-6 w-6 text-white" />,
      title: "Weekly Progress",
      value: `${weeklyProgress}%`,
      description: "Your habit completion rate for this week",
      delay: 0.3,
      gradientFrom: "emerald-500",
      gradientTo: "green-600"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-white" />,
      title: "Monthly Average",
      value: `${monthlyAverage}%`,
      description: "Your average habit completion rate over the past month",
      delay: 0.4,
      gradientFrom: "violet-500",
      gradientTo: "purple-600"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "Best Streak",
      value: `${bestStreak} Days`,
      description: "Your longest streak of consistent habit completion",
      delay: 0.5,
      gradientFrom: "fuchsia-500",
      gradientTo: "pink-600"
    }
  ];

  return (
    <div>
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-white mb-4 flex items-center gap-2"
      >
        <TrendingUp className="w-5 h-5 text-indigo-400" />
        Your Stats
      </motion.h3>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
