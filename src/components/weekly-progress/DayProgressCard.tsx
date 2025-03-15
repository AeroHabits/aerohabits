
import { motion } from "framer-motion";
import { Progress } from "../ui/progress";
import { DayData, getStatusIcon, getStatusClass } from "./weeklyProgressUtils";

interface DayProgressCardProps {
  day: DayData;
  index: number;
}

export function DayProgressCard({ day, index }: DayProgressCardProps) {
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
