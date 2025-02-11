
import { motion } from "framer-motion";
import { HabitCard } from "./HabitCard";
import type { Habit } from "@/types";

interface HabitListContentProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  setHabitToDelete: (id: string | null) => void;
}

export function HabitListContent({ habits, onToggle, onDelete, setHabitToDelete }: HabitListContentProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <HabitCard
            id={habit.id}
            title={habit.title}
            description={habit.description}
            streak={habit.streak}
            completed={habit.completed}
            streak_broken={habit.streak_broken}
            last_streak={habit.last_streak}
            category={habit.habit_categories}
            onToggle={() => onToggle(habit.id)}
            onDelete={() => onDelete(habit.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
