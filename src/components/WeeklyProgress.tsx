
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JourneyChart } from "./JourneyChart";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export function WeeklyProgress() {
  const { data: habits } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Generate an array of the last 7 days
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    const dayHabits = habits?.filter(habit => {
      const habitDate = new Date(habit.created_at);
      return habitDate >= dayStart && habitDate <= dayEnd;
    }) || [];
    
    return {
      day: format(date, 'EEE'),
      completed: dayHabits.filter(habit => habit.completed).length,
      total: dayHabits.length,
      percentage: dayHabits.length > 0 
        ? Math.round((dayHabits.filter(habit => habit.completed).length / dayHabits.length) * 100)
        : 0
    };
  });

  // Calculate actual totals based on all habits within the 7-day period
  const now = new Date();
  const weekAgo = subDays(now, 6);
  const weekHabits = habits?.filter(habit => {
    const habitDate = new Date(habit.created_at);
    return habitDate >= startOfDay(weekAgo) && habitDate <= endOfDay(now);
  }) || [];

  const totalCompleted = weekHabits.filter(habit => habit.completed).length;
  const totalHabits = weekHabits.length;
  const weeklyPercentage = totalHabits > 0 
    ? Math.round((totalCompleted / totalHabits) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/20 backdrop-blur-sm border-white/30 shadow-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Habit Completion Analysis
              </h2>
              <p className="text-sm text-white/80">
                7-Day Performance Overview
              </p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-white">
                {weeklyPercentage}% Success Rate
              </span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <JourneyChart data={weeklyData} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white font-medium">Completed Tasks</p>
              <p className="text-2xl font-bold text-white">{totalCompleted}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{totalHabits}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
