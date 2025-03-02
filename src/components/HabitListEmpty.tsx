
import { AddHabitForm } from "./AddHabitForm";
import { motion } from "framer-motion";
import { Calendar, PlusCircle } from "lucide-react";

interface HabitListEmptyProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function HabitListEmpty({ onAddHabit }: HabitListEmptyProps) {
  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
          <Calendar className="h-8 w-8 text-blue-300" />
        </div>
        <h2 className="text-2xl font-semibold text-white">No habits yet</h2>
        <p className="text-white/80 font-medium max-w-md mx-auto">
          Start building your daily routine by adding your first habit below.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-md mx-auto bg-white/5 p-6 rounded-xl border border-white/10 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-medium text-white">Create Your First Habit</h3>
        </div>
        <AddHabitForm onAddHabit={onAddHabit} />
      </motion.div>
    </div>
  );
}
