import { HabitCard } from "./HabitCard";
import { AddHabitForm } from "./AddHabitForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { HabitStats } from "./HabitStats";
import { HabitListEmpty } from "./HabitListEmpty";
import { HabitListLoading } from "./HabitListLoading";

interface Habit {
  id: string;
  title: string;
  description: string;
  streak: number;
  completed: boolean;
  category?: string;
}

export function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHabits(habits.filter(habit => habit.id !== id));
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update({ completed: !habit.completed })
        .eq('id', id);

      if (error) throw error;

      setHabits(habits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      ));

      toast({
        title: "Success",
        description: `Habit marked as ${!habit.completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    }
  };

  const addHabit = async ({ title, description, category }: { title: string; description: string; category?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            title,
            description,
            category,
            streak: 0,
            completed: false,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setHabits([data, ...habits]);
      toast({
        title: "Success",
        description: "New habit added successfully!",
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <HabitListLoading />;
  }

  const totalStreaks = habits.reduce((acc, habit) => acc + (habit.streak || 0), 0);

  if (habits.length === 0) {
    return <HabitListEmpty onAddHabit={addHabit} />;
  }

  return (
    <div className="space-y-8">
      <HabitStats totalHabits={habits.length} totalStreaks={totalStreaks} />
      <AnimatePresence>
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
                      onToggle={() => toggleHabit(habit.id)}
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
                      onClick={() => habit.id && deleteHabit(habit.id)}
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
      </AnimatePresence>
      <div className="max-w-md mx-auto">
        <AddHabitForm onAddHabit={addHabit} />
      </div>
    </div>
  );
}