
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { HabitCard } from "./HabitCard";
import type { Habit } from "@/types";

interface HabitListContentProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  setHabitToDelete: (id: string | null) => void;
}

export const HabitListContent = memo(function HabitListContent({ 
  habits, 
  onToggle, 
  onDelete, 
  setHabitToDelete 
}: HabitListContentProps) {
  const containerVariants = useMemo(() => ({
    hidden: {},
    visible: { 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.1 
      }
    }
  }), []);
  
  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }), []);

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          variants={itemVariants}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          layout
          className="h-full will-change-transform"
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
    </motion.div>
  );
});

HabitListContent.displayName = "HabitListContent";
