
import { format, parseISO, subDays, startOfDay, endOfDay, startOfWeek, isWithinInterval, isSameDay } from "date-fns";
import { Flame, Star, Rocket, Calendar } from "lucide-react";

export type DayData = {
  day: string;
  shortDay: string;
  date: string;
  completed: number;
  total: number;
  percentage: number;
  emoji: string;
  isToday: boolean;
};

// Generate data for days in the current week
export function generateWeeklyData(habits: any[] | undefined) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    // Filter habits for this specific day
    const dayHabits = habits?.filter(habit => {
      const habitDate = parseISO(habit.updated_at);
      return isWithinInterval(habitDate, { start: dayStart, end: dayEnd });
    }) || [];
    
    const completed = dayHabits.filter(habit => habit.completed).length;
    const total = dayHabits.length;
    
    return {
      day: format(date, 'EEEE'),
      shortDay: format(date, 'EEE'),
      date: format(date, 'MMM d'),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      emoji: getEmoji(total > 0 ? Math.round((completed / total) * 100) : 0),
      isToday: isSameDay(date, new Date())
    };
  });
}

// Calculate emoji for each day
export function getEmoji(percentage: number): string {
  if (percentage >= 80) return "🔥";
  if (percentage >= 50) return "⭐";
  if (percentage > 0) return "📈";
  return "🎯";
}

// Get icon component based on percentage
export function getStatusIcon(percentage: number) {
  if (percentage >= 80) return <Flame className="h-5 w-5 text-orange-400" />;
  if (percentage >= 50) return <Star className="h-5 w-5 text-yellow-400" />;
  if (percentage > 0) return <Rocket className="h-5 w-5 text-blue-400" />;
  return <Calendar className="h-5 w-5 text-gray-400" />;
}

// Get CSS class based on percentage
export function getStatusClass(percentage: number) {
  if (percentage >= 80) return "from-orange-500 to-red-500";
  if (percentage >= 50) return "from-yellow-400 to-amber-500";
  if (percentage > 0) return "from-blue-400 to-indigo-500";
  return "from-gray-500 to-gray-600";
}

// Calculate weekly totals
export function calculateWeeklyTotals(weeklyData: DayData[]) {
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const totalHabits = weeklyData.reduce((sum, day) => sum + day.total, 0);
  const weeklyPercentage = totalHabits > 0 
    ? Math.round((totalCompleted / totalHabits) * 100) 
    : 0;
    
  return { totalCompleted, totalHabits, weeklyPercentage };
}
