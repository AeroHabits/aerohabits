
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Habit } from "@/types";
import { isToday, isYesterday, startOfDay, startOfTomorrow, isSameDay, subDays } from "date-fns";
import { useOfflineSync } from "./useOfflineSync";
import { useLocalStorage } from "./useLocalStorage";

export function useHabitOperations() {
  const { toast } = useToast();
  const { queueSync, debouncedSync, isOnline } = useOfflineSync();
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();

  const deleteHabit = async (id: string) => {
    try {
      if (!isOnline) {
        const currentHabits = loadOfflineHabits();
        const updatedHabits = currentHabits.filter((h: Habit) => h.id !== id);
        saveOfflineHabits(updatedHabits);
        await queueSync(id, 'habit', 'delete');
        toast({
          title: "Success",
          description: "Habit deleted successfully (offline mode)",
        });
        return true;
      }

      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleHabit = async (id: string, habits: Habit[]) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;

    try {
      const today = startOfDay(new Date());
      const yesterday = subDays(today, 1);
      const lastUpdate = habit.updated_at ? startOfDay(new Date(habit.updated_at)) : null;
      
      // Enhanced streak logic for midnight reset:
      // If completing the habit for today, check various conditions for streak maintenance
      let streakValue = habit.streak || 0;
      
      if (!habit.completed) {
        // User is completing the habit
        if (!lastUpdate) {
          // First time completing this habit
          streakValue = 1;
        } else if (isSameDay(lastUpdate, today)) {
          // Already updated today but was uncompleted
          streakValue += 1;
        } else if (isSameDay(lastUpdate, yesterday)) {
          // Completed yesterday and now today - maintain streak
          streakValue += 1;
        } else {
          // Habit was last completed 2+ days ago - reset streak
          streakValue = 1;
        }
      } else {
        // User is uncompleting the habit
        // Only reduce streak if it was completed today
        if (isSameDay(lastUpdate, today)) {
          streakValue = Math.max(0, streakValue - 1);
        }
      }
      
      const updatedHabit = {
        ...habit,
        completed: !habit.completed,
        streak: streakValue,
        updated_at: new Date().toISOString()
      };

      if (!isOnline) {
        const currentHabits = loadOfflineHabits();
        const updatedHabits = currentHabits.map((h: Habit) => 
          h.id === id ? updatedHabit : h
        );
        saveOfflineHabits(updatedHabits);
        await queueSync(id, 'habit', 'update', {
          completed: updatedHabit.completed,
          streak: updatedHabit.streak,
          updated_at: updatedHabit.updated_at
        });
        debouncedSync();
        toast({
          title: "Success",
          description: `Habit ${!habit.completed ? 'completed' : 'uncompleted'} for today! (offline mode)`,
        });
        return true;
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

      toast({
        title: "Success",
        description: `Habit ${!habit.completed ? 'completed' : 'uncompleted'} for today!`,
      });
      return true;
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
      return false;
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
        await queueSync(newHabit.id, 'habit', 'add', newHabit);
        debouncedSync();
        toast({
          title: "Success",
          description: "New habit added successfully! (offline mode)",
        });
        return true;
      }

      const { error } = await supabase
        .from('habits')
        .insert([newHabit]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "New habit added successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    deleteHabit,
    toggleHabit,
    addHabit,
  };
}
