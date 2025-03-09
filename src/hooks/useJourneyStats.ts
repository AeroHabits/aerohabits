
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isToday, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Habit } from "@/types";

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
  
  // For completedHabits, we count habits that are currently completed
  const completedHabits = habits.filter(h => h.completed).length;
  
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;
  
  // Calculate weekly progress based on habits completed in the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: startOfDay(date),
      endDate: endOfDay(date)
    };
  });

  // Count habits completed on each of the last 7 days
  const habitsCompletedInWeek = last7Days.reduce((count, day) => {
    const completedForDay = habits.filter((h: Habit) => {
      if (!h.updated_at) return false;
      
      const updateDate = parseISO(h.updated_at);
      return isWithinInterval(updateDate, { 
        start: day.date, 
        end: day.endDate 
      }) && h.completed;
    }).length;
    
    return count + completedForDay;
  }, 0);
  
  // Total possible completions for the week (habits × 7 days)
  const totalPossibleCompletions = totalHabits * 7;
  
  const weeklyProgress = totalPossibleCompletions > 0 
    ? Math.round((habitsCompletedInWeek / totalPossibleCompletions) * 100)
    : 0;
  
  // Calculate monthly average (using the weekly data as an approximation)
  const monthlyAverage = weeklyProgress; // Simplified for now, could be enhanced

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
