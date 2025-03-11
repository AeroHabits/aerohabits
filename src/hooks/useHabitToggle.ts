
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { Habit } from "@/types";
import { isToday, isYesterday, startOfDay, isSameDay, subDays } from "date-fns";
import { useOfflineSync } from "./useOfflineSync";
import { useLocalStorage } from "./useLocalStorage";
import { useState, useCallback } from "react";

export function useHabitToggle() {
  const { toast } = useToast();
  const { queueSync, debouncedSync } = useOfflineSync();
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();
  const { isOnline } = useOfflineSync();
  const [pendingToggles, setPendingToggles] = useState<Record<string, boolean>>({});

  const toggleHabit = useCallback(async (id: string, habits: Habit[]) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;

    // Update UI immediately with optimistic update
    setPendingToggles(prev => ({ ...prev, [id]: true }));
    
    try {
      const today = startOfDay(new Date());
      const yesterday = subDays(today, 1);
      const lastUpdate = habit.updated_at ? startOfDay(new Date(habit.updated_at)) : null;
      
      // Check if the last update was today or yesterday
      // This is crucial for maintaining streaks across midnight resets
      const maintainedStreak = lastUpdate && (
        isSameDay(lastUpdate, today) || 
        (isSameDay(lastUpdate, yesterday) && habit.completed)
      );
      
      const updatedHabit = {
        ...habit,
        completed: !habit.completed,
        streak: !habit.completed 
          ? (maintainedStreak ? (habit.streak || 0) + 1 : 1)
          : Math.max(0, (habit.streak || 0) - 1),
        updated_at: new Date().toISOString()
      };

      // Apply optimistic UI update before network operation completes
      const actionLabel = !habit.completed ? 'completed' : 'uncompleted';
      
      // Use Sonner toast for better performance 
      sonnerToast.success(`Habit ${actionLabel}`, {
        description: !habit.completed 
          ? `Great job! ${updatedHabit.streak > 1 ? `Streak: ${updatedHabit.streak} days` : ''}` 
          : "You can always try again tomorrow"
      });

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
        setPendingToggles(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        return true;
      }

      // Perform DB update in background
      supabase
        .from('habits')
        .update({ 
          completed: updatedHabit.completed,
          streak: updatedHabit.streak,
          updated_at: updatedHabit.updated_at
        })
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.error('Error in background habit update:', error);
            // Revert optimistic update if network request fails
            sonnerToast.error("Failed to save habit status");
          }
          setPendingToggles(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
          });
        });

      return true;
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
      
      // Clean up pending state on error
      setPendingToggles(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      
      return false;
    }
  }, [toast, queueSync, debouncedSync, loadOfflineHabits, saveOfflineHabits, isOnline]);

  return { toggleHabit, pendingToggles };
}
