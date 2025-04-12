import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Habit } from "@/types";
import { isToday, isYesterday, startOfDay, isSameDay, parseISO, isAfter, addHours } from "date-fns";
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
      const now = new Date();
      const lastUpdate = habit.updated_at ? new Date(habit.updated_at) : null;
      
      // Enforce 8-hour delay between streak days
      const MIN_HOURS_BETWEEN_STREAK_DAYS = 8;
      
      // Improved streak calculation logic with 8-hour delay requirement:
      // 1. If the habit is already completed today, uncompleting it reduces the streak
      // 2. If the habit is not completed:
      //    a. If last completed was yesterday and at least 8 hours have passed, increment streak
      //    b. If last completed today (same day update), increment streak
      //    c. If last completed was earlier than yesterday, start fresh with streak of 1
      //    d. If last completed was yesterday but less than 8 hours have passed, show a message
      
      let newStreak = habit.streak || 0;
      
      // Check if we're completing or uncompleting
      if (!habit.completed) {
        // We are completing the habit now
        if (lastUpdate) {
          const lastUpdateDay = startOfDay(lastUpdate);
          
          // Check if the last update was yesterday
          if (isYesterday(lastUpdateDay)) {
            // If completed yesterday, check if 8 hours have passed since last completion
            const minimumTimeRequired = addHours(lastUpdate, MIN_HOURS_BETWEEN_STREAK_DAYS);
            
            if (isAfter(now, minimumTimeRequired)) {
              // At least 8 hours have passed, continue the streak
              newStreak += 1;
            } else {
              // Less than 8 hours have passed since yesterday's completion
              // Still allow completion but notify the user about streak rules
              toast({
                title: "Streak Notice",
                description: `You need to wait at least 8 hours between completions to increase your streak. Your streak will remain at ${newStreak}.`,
                duration: 5000,
              });
              // Keep the streak the same
            }
          } else if (isSameDay(lastUpdateDay, today)) {
            // Already updated today, but may have uncompleted it
            newStreak += 1;
          } else {
            // Last update was older than yesterday
            // We're starting a new streak
            newStreak = 1;
          }
        } else {
          // First time ever completing this habit
          newStreak = 1;
        }
      } else {
        // We are uncompleting a previously completed habit
        // Decrease streak, but don't go below 0
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
