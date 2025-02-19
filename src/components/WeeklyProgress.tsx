
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, isWithinInterval } from "date-fns";

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

  // Get the start of the current week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday

  // Generate data for the current week
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    // Filter habits for this day
    const dayHabits = habits?.filter(habit => {
      const habitDate = new Date(habit.updated_at);
      return isWithinInterval(habitDate, { start: dayStart, end: dayEnd });
    }) || [];
    
    const completed = dayHabits.filter(habit => habit.completed).length;
    const total = dayHabits.length;
    
    return {
      day: format(date, 'EEEE'),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  // Calculate weekly totals
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const totalHabits = weeklyData.reduce((sum, day) => sum + day.total, 0);
  const weeklyPercentage = totalHabits > 0 
    ? Math.round((totalCompleted / totalHabits) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Weekly Progress
              </h2>
              <p className="text-sm text-white/80">
                Current Week Overview
              </p>
            </div>
            <div className="bg-black/30 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-white">
                {weeklyPercentage}% Overall Success
              </span>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-black/30 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white">{day.day}</h3>
                  <span className="text-sm text-white/80">
                    {day.percentage}% Complete
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-white">
                  {day.completed} of {day.total} habits completed
                </p>
                {day.total > 0 && (
                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-white/30 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${day.percentage}%` }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-sm text-white/80 font-medium">Completed Tasks</p>
              <p className="text-2xl font-bold text-white">{totalCompleted}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-sm text-white/80 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{totalHabits}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
