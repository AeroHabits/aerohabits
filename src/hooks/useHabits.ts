
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isToday, isYesterday, startOfDay } from "date-fns";
import { Habit, HabitCategory } from "@/types";
import { useOnlineStatus } from "./useOnlineStatus";

const HABITS_STORAGE_KEY = 'offlineHabits';

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  // Load habits from local storage
  const loadOfflineHabits = () => {
    const stored = localStorage.getItem(HABITS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  // Save habits to local storage
  const saveOfflineHabits = (habits: Habit[]) => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  };

  const { data: habits = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      // If offline, return from local storage
      if (!isOnline) {
        return loadOfflineHabits();
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select(`
          *,
          habit_categories (
            id,
            name,
            color,
            icon
          )
        `)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;
      
      // Save to local storage for offline access
      saveOfflineHabits(habitsData || []);
      return habitsData || [];
    },
  });

  const deleteHabit = async (id: string) => {
    try {
      if (!isOnline) {
        const currentHabits = loadOfflineHabits();
        const updatedHabits = currentHabits.filter((h: Habit) => h.id !== id);
        saveOfflineHabits(updatedHabits);
        refetch();
        toast({
          title: "Success",
          description: "Habit deleted successfully (offline mode)",
        });
        return;
      }

      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      refetch();
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
      const today = startOfDay(new Date());
      const lastUpdate = habit.updated_at ? startOfDay(new Date(habit.updated_at)) : null;
      const maintainedStreak = lastUpdate && (isYesterday(lastUpdate) || isToday(lastUpdate));
      
      const updatedHabit = {
        ...habit,
        completed: !habit.completed,
        streak: !habit.completed 
          ? (maintainedStreak ? (habit.streak || 0) + 1 : 1)
          : Math.max(0, (habit.streak || 0) - 1),
        updated_at: new Date().toISOString()
      };

      if (!isOnline) {
        const currentHabits = loadOfflineHabits();
        const updatedHabits = currentHabits.map((h: Habit) => 
          h.id === id ? updatedHabit : h
        );
        saveOfflineHabits(updatedHabits);
        refetch();
        toast({
          title: "Success",
          description: `Habit ${!habit.completed ? 'completed' : 'uncompleted'} for today! (offline mode)`,
        });
        return;
      }

      const { error } = await supabase
        .from('habits')
        .update({ 
          completed: updatedHabit.completed,
          streak: updatedHabit.streak,
          updated_at: updatedHabit.updated_at
        })
        .eq('id', id);

      if (error) throw error;

      refetch();
      toast({
        title: "Success",
        description: `Habit ${!habit.completed ? 'completed' : 'uncompleted'} for today!`,
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

  const addHabit = async ({ title, description, category_id }: { title: string; description: string; category_id?: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const newHabit = {
        id: crypto.randomUUID(),
        title,
        description,
        category_id,
        streak: 0,
        completed: false,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        offline_created: !isOnline
      };

      if (!isOnline) {
        const currentHabits = loadOfflineHabits();
        saveOfflineHabits([newHabit, ...currentHabits]);
        refetch();
        toast({
          title: "Success",
          description: "New habit added successfully! (offline mode)",
        });
        return;
      }

      const { error } = await supabase
        .from('habits')
        .insert([newHabit]);

      if (error) throw error;

      refetch();
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

  return {
    habits,
    isLoading,
    error,
    habitToDelete,
    setHabitToDelete,
    deleteHabit,
    toggleHabit,
    addHabit,
    refetch,
    isFetching,
    isOnline,
  };
}
