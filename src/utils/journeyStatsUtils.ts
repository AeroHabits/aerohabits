
import { Habit } from "@/types";
import { parseISO, isToday, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";

/**
 * Calculates basic habit statistics
 */
export function calculateBasicStats(habits: Habit[]) {
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;
    
  return {
    totalHabits,
    completedHabits,
    completionRate
  };
}

/**
 * Generates an array of date ranges for the last 7 days
 */
export function getLast7DaysRanges() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: startOfDay(date),
      endDate: endOfDay(date)
    };
  });
}

/**
 * Checks if a habit was completed within a specific date range
 */
export function wasHabitCompletedInRange(habit: Habit, startDate: Date, endDate: Date): boolean {
  if (!habit.updated_at) return false;
  
  const updateDate = parseISO(habit.updated_at);
  return isWithinInterval(updateDate, { 
    start: startDate, 
    end: endDate 
  }) && habit.completed;
}

/**
 * Calculates weekly progress statistics
 */
export function calculateWeeklyProgress(habits: Habit[]) {
  const last7Days = getLast7DaysRanges();

  // Count habits completed on each of the last 7 days
  const habitsCompletedInWeek = last7Days.reduce((count, day) => {
    const completedForDay = habits.filter((h: Habit) => 
      wasHabitCompletedInRange(h, day.date, day.endDate)
    ).length;
    
    return count + completedForDay;
  }, 0);
  
  // Total possible completions for the week (habits × 7 days)
  const totalPossibleCompletions = habits.length * 7;
  
  const weeklyProgress = totalPossibleCompletions > 0 
    ? Math.round((habitsCompletedInWeek / totalPossibleCompletions) * 100)
    : 0;
    
  return {
    habitsCompletedInWeek,
    totalPossibleCompletions,
    weeklyProgress
  };
}

/**
 * Calculates streak-related statistics
 */
export function calculateStreakStats(habits: Habit[]) {
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
    bestStreak,
    currentStreak
  };
}
