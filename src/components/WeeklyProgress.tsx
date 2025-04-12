
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { format, startOfWeek } from "date-fns";
import { DayProgressCard } from "./weekly-progress/DayProgressCard";
import { WeeklySummaryStats } from "./weekly-progress/WeeklySummaryStats";
import { WeeklyProgressHeader } from "./weekly-progress/WeeklyProgressHeader";
import { WeeklyProgressSkeleton } from "./weekly-progress/WeeklyProgressSkeleton";
import { generateWeeklyData, calculateWeeklyTotals } from "./weekly-progress/weeklyProgressUtils";
import { memo } from "react";

// Memoize the day progress cards to prevent unnecessary rerenders
const MemoizedDayProgressCard = memo(DayProgressCard);

export function WeeklyProgress() {
  const { data: habits, isLoading } = useQuery({
    queryKey: ["weekly-habits"],
    queryFn: async () => {
      // Get the current week's start date (Monday)
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      
      // Format dates for the query
      const formattedWeekStart = format(weekStart, 'yyyy-MM-dd');
      const formattedToday = format(new Date(), 'yyyy-MM-dd');
      
      // Get habits updated in the last 7 days
      const { data, error } = await supabase
        .from("habits")
        .select(`
          id,
          title,
          completed,
          updated_at,
          habit_categories (
            id,
            name,
            color
          )
        `)
        .gte('updated_at', formattedWeekStart)
        .lte('updated_at', formattedToday + 'T23:59:59')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching weekly habits:", error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <WeeklyProgressSkeleton />;
  }

  // Generate data for the current week
  const weeklyData = generateWeeklyData(habits);

  // Calculate weekly totals
  const { totalCompleted, totalHabits, weeklyPercentage } = calculateWeeklyTotals(weeklyData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative"
      // Remove expensive background blur effects
      style={{ willChange: 'auto' }} // Optimize for browser rendering
    >
      <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/10 transition-colors duration-300 shadow-xl rounded-xl overflow-hidden">
        <div className="space-y-6">
          <WeeklyProgressHeader weeklyPercentage={weeklyPercentage} />
          
          <div className="grid gap-4 md:grid-cols-2">
            {weeklyData.map((day, index) => (
              <MemoizedDayProgressCard key={day.day} day={day} index={index} />
            ))}
          </div>
          
          <WeeklySummaryStats totalCompleted={totalCompleted} totalHabits={totalHabits} />
        </div>
      </Card>
    </motion.div>
  );
}
