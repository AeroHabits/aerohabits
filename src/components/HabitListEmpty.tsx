import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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
      <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
      <p className="text-muted-foreground mb-4">Create your first habit to start tracking your progress</p>
      <Button onClick={onAddHabit}>
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Your First Habit
      </Button>
    </motion.div>
  );
}