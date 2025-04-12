import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Habit } from "@/types";
import { isToday, isYesterday, startOfDay, isSameDay } from "date-fns";
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
      const lastUpdate = habit.updated_at ? startOfDay(new Date(habit.updated_at)) : null;
      
      // Fixed streak calculation logic:
      // 1. If completing a habit, check if it's already completed (no streak change)
      // 2. If it's not already completed:
      //    - If last update was yesterday or it's still the same day, add to streak
      //    - Otherwise, reset streak to 1 (starting fresh)
      // 3. If uncompleting a habit, decrease streak by 1
      
      let newStreak = habit.streak || 0;
      
      if (!habit.completed) {
        // Completing the habit
        if (lastUpdate) {
          if (isYesterday(lastUpdate) || isSameDay(lastUpdate, today)) {
            // Continuing streak from yesterday or updating today's entry
            newStreak += 1;
          } else {
            // Starting a new streak
            newStreak = 1;
          }
        } else {
          // First time completing - start with 1
          newStreak = 1;
        }
      } else {
        // Uncompleting the habit
        newStreak = Math.max(0, newStreak - 1);
      }
      
      const updatedHabit = {
        ...habit,
        completed: !habit.completed,
        streak: newStreak,
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
