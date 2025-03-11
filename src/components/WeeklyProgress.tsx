
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { BarChart3, Trophy, Flame, Star, Rocket, Calendar, Check, Sparkles } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, isWithinInterval } from "date-fns";
import { Progress } from "./ui/progress";

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
    
    // Find emoji for each day
    const getEmoji = () => {
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      if (percentage >= 80) return "🔥";
      if (percentage >= 50) return "⭐";
      if (percentage > 0) return "📈";
      return "🎯";
    };
    
    return {
      day: format(date, 'EEEE'),
      shortDay: format(date, 'EEE'),
      date: format(date, 'MMM d'),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      emoji: getEmoji(),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    };
  });

  // Calculate weekly totals
  const totalCompleted = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const totalHabits = weeklyData.reduce((sum, day) => sum + day.total, 0);
  const weeklyPercentage = totalHabits > 0 
    ? Math.round((totalCompleted / totalHabits) * 100) 
    : 0;

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) return <Flame className="h-5 w-5 text-orange-400" />;
    if (percentage >= 50) return <Star className="h-5 w-5 text-yellow-400" />;
    if (percentage > 0) return <Rocket className="h-5 w-5 text-blue-400" />;
    return <Calendar className="h-5 w-5 text-gray-400" />;
  };

  const getStatusClass = (percentage: number) => {
    if (percentage >= 80) return "from-orange-500 to-red-500";
    if (percentage >= 50) return "from-yellow-400 to-amber-500";
    if (percentage > 0) return "from-blue-400 to-indigo-500";
    return "from-gray-500 to-gray-600";
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <BarChart3 className="w-6 h-6 text-indigo-400" />
                </motion.div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
                  Weekly Progress
                </span>
              </h2>
              <p className="text-sm text-white/80">
                Current Week Overview
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
              <motion.span 
                className="text-sm font-medium text-white flex items-center gap-1"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-lg text-gradient bg-gradient-to-r from-yellow-200 to-amber-400">{weeklyPercentage}%</span> 
                <span className="text-white/80">Overall Success</span>
              </motion.span>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`relative overflow-hidden rounded-lg p-4 group ${
                  day.isToday 
                    ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-indigo-500/30" 
                    : "bg-black/30"
                }`}
              >
                {day.isToday && (
                  <div className="absolute top-2 right-2 bg-indigo-500 text-xs font-bold px-2 py-1 rounded-full text-white">
                    Today
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${getStatusClass(day.percentage)}`}>
                      {getStatusIcon(day.percentage)}
                    </div>
                    <div>
                      <h3 className="font-medium text-white flex items-center">
                        {day.day} <span className="text-white/60 ml-2 text-sm">{day.date}</span>
                      </h3>
                      <span className="text-sm text-white/80">
                        {day.percentage}% Complete
                      </span>
                    </div>
                  </div>
                  <motion.div 
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 10, scale: 1.2 }}
                    className="text-2xl"
                  >
                    {day.emoji}
                  </motion.div>
                </div>
                
                <div className="mt-3 flex items-center gap-2">
                  <p className="text-lg font-semibold text-white">
                    {day.completed} of {day.total} Habits Completed
                  </p>
                </div>
                
                {day.total > 0 && (
                  <div className="mt-2 w-full">
                    <Progress 
                      value={day.percentage}
                      className="h-3 bg-white/10"
                    />
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getStatusClass(day.percentage)}`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-lg p-4 border border-white/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-white/80 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Completed Tasks
              </p>
              <motion.p 
                className="text-3xl font-bold text-white flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {totalCompleted}
                {totalCompleted > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                  </motion.span>
                )}
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg p-4 border border-white/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-white/80 font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Total Tasks
              </p>
              <motion.p 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {totalHabits}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
