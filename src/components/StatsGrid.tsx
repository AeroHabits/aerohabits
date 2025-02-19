
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
}

const StatCard = ({ icon, title, value, description, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-6 flex items-center space-x-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/20 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300 cursor-pointer shadow-lg">
          <div className="p-2 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-white/90">{title}</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">{value}</p>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-indigo-600/95 to-purple-700/95 backdrop-blur-xl border border-indigo-200/20">
        <DialogHeader>
          <DialogTitle className="text-white font-bold">{title}</DialogTitle>
          <DialogDescription className="text-indigo-100/90">
            {description}
          </DialogDescription>
        </DialogHeader>
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
      icon: <Trophy className="h-10 w-10 text-indigo-300" />,
      title: "Total Habits",
      value: totalHabits,
      description: "The total number of habits you're currently tracking. Each habit represents a step towards your personal growth.",
      delay: 0
    },
    {
      icon: <Flame className="h-10 w-10 text-purple-300" />,
      title: "Current Streak",
      value: `${currentStreak} days`,
      description: "Your ongoing streak of consistently maintaining your habits. Keep it up to build lasting change!",
      delay: 0.1
    },
    {
      icon: <Target className="h-10 w-10 text-indigo-200" />,
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Your overall success rate in completing your habits. This percentage reflects your dedication to self-improvement.",
      delay: 0.2
    },
    {
      icon: <Calendar className="h-10 w-10 text-purple-200" />,
      title: "Weekly Progress",
      value: `${weeklyProgress}%`,
      description: "Your habit completion rate for this week. Track your weekly momentum to stay motivated.",
      delay: 0.3
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-indigo-300" />,
      title: "Monthly Average",
      value: `${monthlyAverage}%`,
      description: "Your average habit completion rate over the past month. A great indicator of your long-term consistency.",
      delay: 0.4
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-purple-300" />,
      title: "Best Streak",
      value: `${bestStreak} days`,
      description: "Your longest streak of consistent habit completion. Can you beat your personal best?",
      delay: 0.5
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
