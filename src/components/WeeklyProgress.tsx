import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JourneyChart } from "./JourneyChart";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

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

  // Calculate weekly progress data
  const weeklyData = Array(7)
    .fill(0)
    .map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const dayHabits = habits?.filter(habit => {
        const habitDate = new Date(habit.created_at);
        return (
          habitDate.getDate() === date.getDate() &&
          habitDate.getMonth() === date.getMonth() &&
          habitDate.getFullYear() === date.getFullYear()
        );
      });
      
      const completed = dayHabits?.filter(habit => habit.completed)?.length || 0;
      const total = dayHabits?.length || 0;
      
      return {
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    })
    .reverse();

  // Calculate week's performance
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
      <Card className="p-6 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm border-white/20 shadow-xl">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Weekly Progress
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Track your completed habits over the past week
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                {weeklyPercentage}% Complete
              </span>
            </div>
          </div>
          
          <div className="bg-white/50 rounded-lg p-4">
            <JourneyChart data={weeklyData} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-800">{totalCompleted}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">Total Habits</p>
              <p className="text-2xl font-bold text-blue-800">{totalHabits}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}