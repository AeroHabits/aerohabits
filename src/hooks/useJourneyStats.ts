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
  const currentStreak = Math.max(...habits.map(h => h.streak || 0), 0);
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;
  const weeklyProgress = 65; // This would be calculated based on actual data
  const monthlyAverage = 78; // This would be calculated based on actual data
  const bestStreak = Math.max(...habits.map(h => h.streak || 0), 0);

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