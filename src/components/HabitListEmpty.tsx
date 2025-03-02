
import { AddHabitForm } from "./AddHabitForm";
import { motion } from "framer-motion";
import { Calendar, PlusCircle } from "lucide-react";

interface HabitListEmptyProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function HabitListEmpty({ onAddHabit }: HabitListEmptyProps) {
  return (
    <div className="text-center space-y-6 px-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="mx-auto w-20 h-20 bg-[#9b87f5]/20 rounded-full flex items-center justify-center mb-6">
          <Calendar className="h-10 w-10 text-[#9b87f5]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">No habits yet</h2>
        <p className="text-white/80 font-medium max-w-md mx-auto text-lg">
          Start building your daily routine by adding your first habit below.
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-xl mx-auto bg-[#1A1F2C] p-6 sm:p-8 rounded-xl border border-white/10 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <PlusCircle className="h-7 w-7 text-[#9b87f5]" />
          <h3 className="text-xl font-semibold text-white">Create Your First Habit</h3>
        </div>
        <AddHabitForm onAddHabit={onAddHabit} />
      </motion.div>
    </div>
  );
}
