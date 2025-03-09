
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateBasicStats, 
  calculateWeeklyProgress, 
  calculateStreakStats 
} from "@/utils/journeyStatsUtils";

export function useJourneyStats() {
  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate basic stats - total, completed, completion rate
  const basicStats = calculateBasicStats(habits);
  
  // Calculate weekly progress
  const weeklyStats = calculateWeeklyProgress(habits);
  
  // Calculate streak statistics
  const streakStats = calculateStreakStats(habits);
  
  // Monthly average (simplified for now, using weekly progress as approximation)
  const monthlyAverage = weeklyStats.weeklyProgress;

  return {
    stats: {
      totalHabits: basicStats.totalHabits,
      completedHabits: basicStats.completedHabits,
      completionRate: basicStats.completionRate,
      weeklyProgress: weeklyStats.weeklyProgress,
      monthlyAverage,
      currentStreak: streakStats.currentStreak,
      bestStreak: streakStats.bestStreak,
    },
    isLoading,
    error,
  };
}
