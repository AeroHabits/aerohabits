
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Habit } from "@/types";
import { isToday, isYesterday, startOfDay, isSameDay, subDays } from "date-fns";
import { useOfflineSync } from "./useOfflineSync";
import { useLocalStorage } from "./useLocalStorage";

export function useHabitToggle() {
  const { toast } = useToast();
  const { queueSync, debouncedSync } = useOfflineSync();
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();
  const { isOnline } = useOfflineSync();

  const toggleHabit = async (id: string, habits: Habit[]) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return false;

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

  return { toggleHabit };
}
