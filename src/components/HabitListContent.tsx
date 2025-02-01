import { motion, AnimatePresence } from "framer-motion";
import { HabitCard } from "./HabitCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Habit } from "@/hooks/useHabits";

interface HabitListContentProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  setHabitToDelete: (id: string | null) => void;
}

export function HabitListContent({ habits, onToggle, onDelete, setHabitToDelete }: HabitListContentProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            onToggle={() => onToggle(habit.id)}
            onDelete={() => (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button onClick={() => setHabitToDelete(habit.id)}>Delete</button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your habit
                      and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => habit.id && onDelete(habit.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}