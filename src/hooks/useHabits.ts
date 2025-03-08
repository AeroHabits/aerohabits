
import { useState, useEffect } from "react";
import { useHabitOperations } from "./useHabitOperations";
import { useOfflineSync } from "./useOfflineSync";
import { useHabitFetcher } from "./useHabitFetcher";

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { deleteHabit, toggleHabit, addHabit } = useHabitOperations();
  const { debouncedSync, isSyncing, isOnline } = useOfflineSync();
  const { 
    habits, 
    isLoading, 
    error, 
    refetch, 
    isFetching,
    networkQuality
  } = useHabitFetcher();

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

  return {
    habits,
    isLoading,
    error,
    habitToDelete,
    setHabitToDelete,
    deleteHabit: (id: string) => deleteHabit(id).then(() => refetch()),
    toggleHabit: (id: string) => toggleHabit(id, habits).then(() => refetch()),
    addHabit: (habit: { title: string; description: string; category_id?: string }) => 
      addHabit(habit).then(() => refetch()),
    refetch, // Expose refetch function to be used by other components
    isFetching,
    isOnline,
    networkQuality,
    isSyncing
  };
}
