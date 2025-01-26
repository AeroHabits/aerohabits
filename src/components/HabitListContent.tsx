import { motion, AnimatePresence } from "framer-motion";
import { HabitCard } from "./HabitCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Habit } from "@/hooks/useHabits";

interface HabitListContentProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  setHabitToDelete: (id: string | null) => void;
}

export function HabitListContent({ habits, onToggle, onDelete, setHabitToDelete }: HabitListContentProps) {
  const completedHabits = habits.filter(habit => habit.completed);
  const incompleteHabits = habits.filter(habit => !habit.completed);

  const HabitList = ({ habits }: { habits: Habit[] }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <motion.div
          key={habit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div>
                <HabitCard
                  id={habit.id}
                  title={habit.title}
                  description={habit.description}
                  streak={habit.streak}
                  completed={habit.completed}
                  onToggle={() => onToggle(habit.id)}
                  onDelete={() => setHabitToDelete(habit.id)}
                />
              </div>
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
        </motion.div>
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full max-w-md mx-auto mb-8 bg-white/30 backdrop-blur-sm border border-white/20 hover:border-white/30">
        <TabsTrigger 
          value="all" 
          className="flex-1 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white font-medium"
        >
          All Habits ({habits.length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed" 
          className="flex-1 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white font-medium"
        >
          Completed Today ({completedHabits.length})
        </TabsTrigger>
        <TabsTrigger 
          value="incomplete" 
          className="flex-1 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white font-medium"
        >
          Remaining ({incompleteHabits.length})
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <TabsContent value="all">
          <HabitList habits={habits} />
        </TabsContent>
        <TabsContent value="completed">
          <HabitList habits={completedHabits} />
        </TabsContent>
        <TabsContent value="incomplete">
          <HabitList habits={incompleteHabits} />
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
}