
import { useState, useEffect } from "react";
import { useHabitOperations } from "./useHabitOperations";
import { useOfflineSync } from "./useOfflineSync";
import { useHabitFetcher } from "./useHabitFetcher";
import { Habit } from "@/types";

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [localHabits, setLocalHabits] = useState<Habit[]>([]);
  const { deleteHabit, toggleHabit, addHabit } = useHabitOperations();
  const { debouncedSync, isSyncing, isOnline } = useOfflineSync();
  const { 
    habits: fetchedHabits, 
    isLoading, 
    error, 
    refetch, 
    isFetching,
    networkQuality
  } = useHabitFetcher();

  // Update local habits when fetched habits change
  useEffect(() => {
    if (fetchedHabits) {
      setLocalHabits(fetchedHabits);
    }
  }, [fetchedHabits]);

  // Sync when coming back online and handle connection quality changes
  useEffect(() => {
    if (isOnline) {
      // Adjust sync strategy based on network quality
      if (networkQuality === 'good') {
        debouncedSync();
      } else if (networkQuality === 'poor') {
        // On poor connections, ensure critical operations sync first
        // This will be handled by the priority system in useOfflineSync
        console.log('Poor network detected, prioritizing critical sync operations');
      }
    }
  }, [isOnline, networkQuality, debouncedSync]);

  // Optimistic UI update for toggle
  const handleToggleHabit = async (id: string) => {
    const { success, updatedHabit } = await toggleHabit(id, localHabits);
    
    if (success && updatedHabit) {
      // Optimistically update the UI
      setLocalHabits(prev => 
        prev.map(habit => habit.id === id ? updatedHabit : habit)
      );
      
      // In the background, refetch to ensure server-client consistency
      setTimeout(() => {
        refetch();
      }, 2000); // Delay refetch to ensure good UX
    }
  };

  // Optimistic UI update for delete
  const handleDeleteHabit = async (id: string) => {
    // Optimistically update UI first
    setLocalHabits(prev => prev.filter(habit => habit.id !== id));
    
    // Then perform actual deletion
    const success = await deleteHabit(id);
    
    if (!success) {
      // If deletion failed, revert optimistic update
      refetch();
    }
  };

  // Optimistic UI update for add
  const handleAddHabit = async (habit: { title: string; description: string; category_id?: string }) => {
    const newHabit = await addHabit(habit);
    if (newHabit) {
      // Refetch to get the server-created habit with proper ID
      refetch();
    }
  };

  return {
    habits: localHabits,
    isLoading,
    error,
    habitToDelete,
    setHabitToDelete,
    deleteHabit: handleDeleteHabit,
    toggleHabit: handleToggleHabit,
    addHabit: handleAddHabit,
    refetch,
    isFetching,
    isOnline,
    networkQuality,
    isSyncing
  };
}
