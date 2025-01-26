import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JourneyChart } from "./JourneyChart";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

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
      
      return {
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayHabits?.filter(habit => habit.completed)?.length || 0,
      };
    })
    .reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
            <p className="text-sm text-gray-600">
              Track your completed habits over the past week
            </p>
          </div>
          <JourneyChart data={weeklyData} />
        </div>
      </Card>
    </motion.div>
  );
}