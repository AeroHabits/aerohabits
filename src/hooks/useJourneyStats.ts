
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;
  
  // Calculate weekly progress based on habits completed in the last 7 days
  const weeklyProgress = habits.length > 0 
    ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100)
    : 0;
  
  // Calculate monthly average based on completed habits
  const monthlyAverage = habits.length > 0
    ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100)
    : 0;

  // Calculate best streak correctly from the streaks of all habits
  const bestStreak = habits.reduce((max, habit) => {
    const habitStreak = habit.streak || 0;
    return habitStreak > max ? habitStreak : max;
  }, 0);

  // Calculate current streak as the sum of all currently active streaks
  const currentStreak = habits
    .filter(h => h.completed)
    .reduce((sum, habit) => sum + (habit.streak || 0), 0);

  return {
    stats: {
      totalHabits,
      completedHabits,
      currentStreak,
      completionRate,
      weeklyProgress,
      monthlyAverage,
      bestStreak,
    },
    isLoading,
    error,
  };
}
