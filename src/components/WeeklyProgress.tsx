
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
          *,
          habit_categories (
            id,
            name,
            color,
            icon
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-blue-900/30 blur-xl -z-10"></div>
      
      <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl rounded-xl overflow-hidden">
        <div className="space-y-6">
          <WeeklyProgressHeader weeklyPercentage={weeklyPercentage} />
          
          <div className="grid gap-4 md:grid-cols-2">
            {weeklyData.map((day, index) => (
              <DayProgressCard key={day.day} day={day} index={index} />
            ))}
          </div>
          
          <WeeklySummaryStats totalCompleted={totalCompleted} totalHabits={totalHabits} />
        </div>
      </Card>
    </motion.div>
  );
}
