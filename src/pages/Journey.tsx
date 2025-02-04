import { WeeklyProgress } from "@/components/WeeklyProgress";
import { StatsGrid } from "@/components/StatsGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Journey = () => {
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

  // Calculate stats
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const currentStreak = Math.max(...habits.map(h => h.streak || 0), 0);
  const completionRate = totalHabits > 0 
    ? Math.round((completedHabits / totalHabits) * 100) 
    : 0;
  const weeklyProgress = 65; // This would be calculated based on actual data
  const monthlyAverage = 78; // This would be calculated based on actual data
  const bestStreak = Math.max(...habits.map(h => h.streak || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-gradient-x">
      <div className="container py-12 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Your Habit Journey
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Track your progress and celebrate your achievements along the way
          </p>
        </motion.div>

        <div className="space-y-8">
          <StatsGrid
            totalHabits={totalHabits}
            currentStreak={currentStreak}
            completionRate={completionRate}
            weeklyProgress={weeklyProgress}
            monthlyAverage={monthlyAverage}
            bestStreak={bestStreak}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WeeklyProgress />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Journey;