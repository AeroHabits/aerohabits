
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isToday, isYesterday, startOfDay } from "date-fns";
import { Habit, HabitCategory } from "@/types";
import { useOnlineStatus } from "./useOnlineStatus";
import { debounce } from "lodash";

const HABITS_STORAGE_KEY = 'offlineHabits';
const SYNC_QUEUE_KEY = 'habitSyncQueue';
const BATCH_SIZE = 10;
const SYNC_DEBOUNCE_MS = 2000;

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  // Load habits from local storage with expiration
  const loadOfflineHabits = () => {
    const stored = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const { habits, timestamp } = JSON.parse(stored);
      // Clear cache if older than 24 hours
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(HABITS_STORAGE_KEY);
        return [];
      }
      return habits;
    } catch {
      return [];
    }
  };

  // Save habits to local storage with timestamp
  const saveOfflineHabits = (habits: Habit[]) => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify({
      habits,
      timestamp: Date.now()
    }));
  };

  // Queue sync operation
  const queueSync = async (habitId: string, action: string, data?: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const queueItem = {
      user_id: user.id,
      habit_id: habitId,
      action,
      data,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('habit_sync_queue')
      .insert([queueItem]);

    if (error) {
      console.error('Error queuing sync:', error);
      // Fallback to local storage if insert fails
      const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
      queue.push(queueItem);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  };

  // Process sync queue in batches
  const processSyncQueue = async () => {
    if (!isOnline) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get queue items from both Supabase and local storage
    const { data: queueItems } = await supabase
      .from('habit_sync_queue')
      .select('*')
      .is('synced_at', null)
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);

    const localQueue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    
    if (!queueItems?.length && !localQueue.length) return;

    const allItems = [...(queueItems || []), ...localQueue];
    
    // Process items in batches
    for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
      const batch = allItems.slice(i, i + BATCH_SIZE);
      
      for (const item of batch) {
        try {
          switch (item.action) {
            case 'add':
              await supabase.from('habits').insert([item.data]);
              break;
            case 'update':
              await supabase.from('habits').update(item.data).eq('id', item.habit_id);
              break;
            case 'delete':
              await supabase.from('habits').delete().eq('id', item.habit_id);
              break;
          }

          // Mark as synced in Supabase queue
          if (item.id) {
            await supabase
              .from('habit_sync_queue')
              .update({ synced_at: new Date().toISOString() })
              .eq('id', item.id);
          }
        } catch (error) {
          console.error('Error processing sync item:', error);
        }
      }
    }

    // Clear local storage queue after processing
    localStorage.removeItem(SYNC_QUEUE_KEY);
    
    // Refresh habits data
    refetch();
  };

  // Debounced sync processor
  const debouncedSync = useCallback(
    debounce(processSyncQueue, SYNC_DEBOUNCE_MS),
    []
  );

  const { data: habits = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
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
        await queueSync(id, 'delete');
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
        await queueSync(id, 'update', {
          completed: updatedHabit.completed,
          streak: updatedHabit.streak,
          updated_at: updatedHabit.updated_at
        });
        debouncedSync();
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
        await queueSync(newHabit.id, 'add', newHabit);
        debouncedSync();
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

  // Try to sync when coming back online
  useState(() => {
    if (isOnline) {
      debouncedSync();
    }
  });

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
