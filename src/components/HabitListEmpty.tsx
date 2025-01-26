import { FileX } from "lucide-react";
import { motion } from "framer-motion";
import { AddHabitForm } from "./AddHabitForm";

interface HabitListEmptyProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function HabitListEmpty({ onAddHabit }: HabitListEmptyProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <FileX className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No habits yet</h3>
      <p className="mt-2 text-sm text-gray-600">Get started by creating your first habit!</p>
      <div className="mt-8 max-w-md mx-auto">
        <AddHabitForm onAddHabit={onAddHabit} />
      </div>
    </motion.div>
  );
}