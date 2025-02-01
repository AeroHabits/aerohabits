import { Calendar, TrendingUp, Award, Star } from "lucide-react";
import { StatsCard } from "./stats/StatsCard";
import { TotalStatsCard } from "./stats/TotalStatsCard";
import { useHabitStats } from "@/hooks/useHabitStats";

export function CumulativeStats() {
  const {
    dailyCompletions,
    weeklyCompletions,
    monthlyCompletions,
    yearlyCompletions,
    totalCompletions,
    longestStreak,
  } = useHabitStats();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Your Achievement Journey</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Calendar}
          iconColor="text-blue-500"
          title="Today"
          value={dailyCompletions}
          subtitle="habits completed"
          delay={0}
        />
        
        <StatsCard
          icon={TrendingUp}
          iconColor="text-green-500"
          title="This Week"
          value={weeklyCompletions}
          subtitle="weekly achievements"
          delay={0.1}
        />
        
        <StatsCard
          icon={Award}
          iconColor="text-purple-500"
          title="This Month"
          value={monthlyCompletions}
          subtitle="monthly progress"
          delay={0.2}
        />
        
        <StatsCard
          icon={Star}
          iconColor="text-yellow-500"
          title="This Year"
          value={yearlyCompletions}
          subtitle="yearly total"
          delay={0.3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TotalStatsCard
          title="Total Habits Completed"
          value={totalCompletions}
          description="Keep going! Every completion counts towards your goals."
          delay={0.4}
        />
        
        <TotalStatsCard
          title="Longest Streak"
          value={`${longestStreak} Days`}
          description="Your dedication is showing! Can you beat this record?"
          delay={0.5}
        />
      </div>
    </div>
  );
}