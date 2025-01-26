import { HabitCard } from "./HabitCard";
import { AddHabitForm } from "./AddHabitForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileX } from "lucide-react";

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

      if (error) {
        console.error('Error fetching habits:', error);
        toast({
          title: "Error",
          description: "Failed to load habits",
          variant: "destructive",
        });
        return;
      }

      setHabits(data || []);
    } catch (error) {
      console.error('Error:', error);
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
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white/70 backdrop-blur-sm rounded-lg border border-[#D3E4FD]/50">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
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
          <AddHabitForm onAddHabit={addHabit} />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
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