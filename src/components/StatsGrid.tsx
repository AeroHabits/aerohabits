
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
  gradient: string;
  accentColor: string;
}

const StatCard = ({ icon, title, value, description, delay, gradient, accentColor }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.03, y: -5 }}
    className="group"
  >
    <Dialog>
      <DialogTrigger asChild>
        <Card className={`relative overflow-hidden cursor-pointer shadow-xl border border-white/10 ${gradient}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6 flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${accentColor} shadow-lg backdrop-blur-lg`}>
              {icon}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/80">{title}</p>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">{value}</h3>
                <p className="text-sm font-medium text-white/70">{description}</p>
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">{title}</DialogTitle>
          <DialogDescription className="text-white/80">
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
      icon: <Trophy className="h-8 w-8 text-amber-200" />,
      title: "Total Habits",
      value: totalHabits,
      description: "Active habits you're currently tracking",
      gradient: "bg-gradient-to-br from-amber-600 to-amber-950",
      accentColor: "bg-amber-500/30",
      delay: 0
    },
    {
      icon: <Flame className="h-8 w-8 text-orange-200" />,
      title: "Current Streak",
      value: `${currentStreak} Days`,
      description: "Keep the momentum going!",
      gradient: "bg-gradient-to-br from-orange-600 to-rose-900",
      accentColor: "bg-rose-500/30",
      delay: 0.1
    },
    {
      icon: <Target className="h-8 w-8 text-blue-200" />,
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: "Your success rate in habit completion",
      gradient: "bg-gradient-to-br from-blue-600 to-blue-950",
      accentColor: "bg-blue-500/30",
      delay: 0.2
    },
    {
      icon: <Calendar className="h-8 w-8 text-emerald-200" />,
      title: "Weekly Progress",
      value: `${weeklyProgress}%`,
      description: "This week's completion rate",
      gradient: "bg-gradient-to-br from-emerald-600 to-emerald-950",
      accentColor: "bg-emerald-500/30",
      delay: 0.3
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-violet-200" />,
      title: "Monthly Average",
      value: `${monthlyAverage}%`,
      description: "Your 30-day completion average",
      gradient: "bg-gradient-to-br from-violet-600 to-violet-950",
      accentColor: "bg-violet-500/30",
      delay: 0.4
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-fuchsia-200" />,
      title: "Best Streak",
      value: `${bestStreak} Days`,
      description: "Your longest habit streak",
      gradient: "bg-gradient-to-br from-fuchsia-600 to-fuchsia-950",
      accentColor: "bg-fuchsia-500/30",
      delay: 0.5
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
