
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { DayProgressCard } from "./journey/DayProgressCard";
import { WeeklyStatCards } from "./journey/WeeklyStatCards";
import { WeeklyProgressHeader } from "./journey/WeeklyProgressHeader";
import { generateWeeklyData, calculateWeeklyTotals } from "@/utils/weeklyProgressUtils";

export function WeeklyProgress() {
  const { data: habits = [] } = useQuery({
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
          
          <WeeklyStatCards totalCompleted={totalCompleted} totalHabits={totalHabits} />
        </div>
      </Card>
    </motion.div>
  );
}
