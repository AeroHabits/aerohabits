import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HabitListEmptyProps {
  onAddHabit: () => void;
}

export function HabitListEmpty({ onAddHabit }: HabitListEmptyProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Sparkles className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Journey!</h3>
        <p className="text-gray-500 mb-4">Create your first habit and begin tracking your progress</p>
      </motion.div>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={onAddHabit}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Your First Habit
        </Button>
      </motion.div>
    </motion.div>
  );
}