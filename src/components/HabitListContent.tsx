
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { HabitCard } from "./HabitCard";
import type { Habit } from "@/types";

// Detect iOS platform
const isIOS = typeof navigator !== 'undefined' && 
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

interface HabitListContentProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  setHabitToDelete: (id: string | null) => void;
}

// Memoized component to prevent unnecessary re-renders
export const HabitListContent = memo(function HabitListContent({ 
  habits, 
  onToggle, 
  onDelete, 
  setHabitToDelete 
}: HabitListContentProps) {
  // Create animation variants based on device
  const containerVariants = useMemo(() => ({
    hidden: {},
    visible: { 
      transition: { 
        staggerChildren: isIOS ? 0.05 : 0.1, 
        delayChildren: isIOS ? 0.05 : 0.1 
      }
    }
  }), []);
  
  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: isIOS ? 10 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: isIOS ? 0.3 : 0.4, 
        type: "spring",
        stiffness: isIOS ? 200 : 100,
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
          layout // Enable smooth transitions when list changes
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
