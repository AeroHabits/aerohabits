import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, Award, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CumulativeStats() {
  const { data: habits } = useQuery({
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

  // Calculate time periods
  const now = new Date();
  const dayStart = new Date(now.setHours(0, 0, 0, 0));
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Calculate completions for different time periods
  const dailyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= dayStart && habit.completed
  ).length || 0;

  const weeklyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= weekStart && habit.completed
  ).length || 0;

  const monthlyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= monthStart && habit.completed
  ).length || 0;

  const yearlyCompletions = habits?.filter(habit => 
    new Date(habit.created_at) >= yearStart && habit.completed
  ).length || 0;

  // Calculate streaks and totals
  const totalCompletions = habits?.filter(habit => habit.completed).length || 0;
  const longestStreak = habits?.reduce((max, habit) => 
    Math.max(max, habit.streak || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Your Achievement Journey</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-4">
              <Calendar className="h-10 w-10 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-700">Today</h3>
                <p className="text-2xl font-bold text-gray-900">{dailyCompletions}</p>
                <p className="text-sm text-gray-500">habits completed</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-10 w-10 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-700">This Week</h3>
                <p className="text-2xl font-bold text-gray-900">{weeklyCompletions}</p>
                <p className="text-sm text-gray-500">weekly achievements</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-4">
              <Award className="h-10 w-10 text-purple-500" />
              <div>
                <h3 className="font-semibold text-gray-700">This Month</h3>
                <p className="text-2xl font-bold text-gray-900">{monthlyCompletions}</p>
                <p className="text-sm text-gray-500">monthly progress</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-4">
              <Star className="h-10 w-10 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-700">This Year</h3>
                <p className="text-2xl font-bold text-gray-900">{yearlyCompletions}</p>
                <p className="text-sm text-gray-500">yearly total</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">{totalCompletions}</h3>
              <p className="text-gray-600">Total Habits Completed</p>
              <p className="text-sm text-gray-500 mt-2">
                Keep going! Every completion counts towards your goals.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">{longestStreak} Days</h3>
              <p className="text-gray-600">Longest Streak</p>
              <p className="text-sm text-gray-500 mt-2">
                Your dedication is showing! Can you beat this record?
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}