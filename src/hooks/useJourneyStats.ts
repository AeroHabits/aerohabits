
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";

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

  // Get the start of the current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
  
  // Filter habits for the current week
  const weeklyHabits = habits.filter(habit => {
    if (!habit.updated_at) return false;
    const habitDate = parseISO(habit.updated_at);
    return isWithinInterval(habitDate, {
      start: startOfDay(weekStart),
      end: endOfDay(new Date())
    });
  });
  
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;
  
  // Calculate weekly progress based on habits completed in the current week
  const weeklyProgress = weeklyHabits.length > 0 
    ? Math.round((weeklyHabits.filter(h => h.completed).length / weeklyHabits.length) * 100)
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
