
import { format, subDays, startOfDay, endOfDay, startOfWeek, isSameDay, parseISO } from "date-fns";
import { Habit } from "@/types";

export interface DayData {
  day: string;
  shortDay: string;
  date: string;
  completed: number;
  total: number;
  percentage: number;
  emoji: string;
  isToday: boolean;
}

// Helper function to check if a habit was completed on a specific day
export function wasCompletedOnDay(habit: Habit, day: Date): boolean {
  // If the habit doesn't have an updated_at date, it can't have been completed on any day
  if (!habit.updated_at) return false;
  
  const habitDate = parseISO(habit.updated_at);
  
  // Check if the habit's update date (when it was completed) is on the same day
  return isSameDay(habitDate, day) && habit.completed;
}

// Generate data for the weekly progress
export function generateWeeklyData(habits: Habit[]): DayData[] {
  // Get the start of the current week (Monday)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
  
  // Generate data for each day of the current week (Monday to Sunday)
  return Array.from({ length: 7 }, (_, index) => {
    // Calculate the date for each day of the week
    // For index 6, that's Sunday which is weekStart + 6 days
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    // Filter habits for this day's completion status
    const completedHabitsForDay = habits.filter((habit: Habit) => {
      if (!habit.completed && !wasCompletedOnDay(habit, dayStart)) {
        return false;
      }
      
      // Only process habits that have updated_at date
      if (!habit.updated_at) return false;
      
      const habitUpdateDate = parseISO(habit.updated_at);
      
      // Check if the habit was completed on this specific day
      return isSameDay(habitUpdateDate, date);
    });
    
    // Count all habits as the "total" for the day
    const totalHabitsForDay = habits.length;
    
    // Calculate percentage
    const percentage = totalHabitsForDay > 0 
      ? Math.round((completedHabitsForDay.length / totalHabitsForDay) * 100) 
      : 0;
    
    // Find emoji for each day
    const getEmoji = () => {
      if (percentage >= 80) return "🔥";
      if (percentage >= 50) return "⭐";
      if (percentage > 0) return "📈";
      return "🎯";
    };
    
    // Check if this is today
    const isToday = isSameDay(date, new Date());
    
    return {
      day: format(date, 'EEEE'),
      shortDay: format(date, 'EEE'),
      date: format(date, 'MMM d'),
      completed: completedHabitsForDay.length,
      total: totalHabitsForDay,
      percentage,
      emoji: getEmoji(),
      isToday
    };
  });
}

// Calculate weekly totals
export function calculateWeeklyTotals(weeklyData: DayData[]) {
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const totalHabits = weeklyData.reduce((sum, day) => sum + day.total, 0);
  const weeklyPercentage = totalHabits > 0 
    ? Math.round((totalCompleted / totalHabits) * 100) 
    : 0;
    
  return {
    totalCompleted,
    totalHabits,
    weeklyPercentage
  };
}
