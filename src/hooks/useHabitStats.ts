import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useHabitStats() {
  const { data: habits } = useQuery({
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

  // Calculate time periods
  const now = new Date();
  const dayStart = new Date(now.setHours(0, 0, 0, 0));
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Calculate completions for different time periods
  const dailyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= dayStart && habit.completed
  ).length || 0;

  const weeklyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= weekStart && habit.completed
  ).length || 0;

  const monthlyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= monthStart && habit.completed
  ).length || 0;

  const yearlyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= yearStart && habit.completed
  ).length || 0;

  // Calculate streaks and totals
  const totalCompletions = habits?.filter(habit => habit.completed).length || 0;
  const longestStreak = habits?.reduce((max, habit) => 
    Math.max(max, habit.streak || 0), 0) || 0;

  return {
    dailyCompletions,
    weeklyCompletions,
    monthlyCompletions,
    yearlyCompletions,
    totalCompletions,
    longestStreak,
  };
}