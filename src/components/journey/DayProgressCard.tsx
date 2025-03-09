
import { motion } from "framer-motion";
import { Flame, Star, Rocket, Calendar, Check } from "lucide-react";
import { isSameDay, parseISO } from "date-fns";
import { Progress } from "../ui/progress";
import { Habit } from "@/types";

interface DayData {
  day: string;
  shortDay: string;
  date: string;
  completed: number;
  total: number;
  percentage: number;
  emoji: string;
  isToday: boolean;
}

interface DayProgressCardProps {
  day: DayData;
  index: number;
}

export function DayProgressCard({ day, index }: DayProgressCardProps) {
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
  );
}
