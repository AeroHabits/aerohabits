
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useHabitOperations } from "./useHabitOperations";
import { useOfflineSync } from "./useOfflineSync";
import { useNetworkQuality } from "./habits/useNetworkQuality";
import { useCachedData } from "./habits/useCachedData";
import { useRetryStrategy } from "./habits/useRetryStrategy";

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { deleteHabit, toggleHabit, addHabit } = useHabitOperations();
  const { debouncedSync, isOnline, isSyncing } = useOfflineSync();
  
  // Use our new hooks
  const { networkQuality, getStaleTime } = useNetworkQuality(isOnline);
  const { 
    shouldSkipNetworkRequest,
    loadOfflineHabits,
    saveOfflineHabits,
    lastSyncTime,
    setLastSyncTime
  } = useCachedData(isOnline, networkQuality);
  const { shouldRetry } = useRetryStrategy(isOnline, networkQuality);

  const { 
    data: habits = [], 
    isLoading, 
    error, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      try {
        // Check if we should use offline data
        if (shouldSkipNetworkRequest()) {
          console.log(`Using cached habits due to ${!isOnline ? 'offline' : 'poor network'} status`);
          return loadOfflineHabits();
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No authenticated user found");
          return loadOfflineHabits();
        }

        // Use connection pooling for better performance
        const startTime = performance.now();
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

        const queryTime = performance.now() - startTime;
        console.log(`Habits query completed in ${queryTime.toFixed(2)}ms`);

        if (habitsError) {
          console.error('Error fetching habits:', habitsError);
          return loadOfflineHabits();
        }
        
        // Update last sync time for intelligent cache decisions
        setLastSyncTime(Date.now());
        
        // Save to offline storage with critical importance
        saveOfflineHabits(habitsData || []);
        return habitsData || [];
      } catch (error) {
        console.error('Error in habits query:', error);
        return loadOfflineHabits();
      }
    },
    retry: shouldRetry,
    staleTime: getStaleTime(),
    refetchOnWindowFocus: networkQuality === 'good', // Only refetch automatically on good connections
    refetchInterval: networkQuality === 'good' ? 60000 : false, // Refresh every minute on good connections
  });

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
    refetch,
    isFetching,
    isOnline,
    networkQuality,  // Expose network quality to UI for potential indicators
    isSyncing        // Expose sync status for UI indicators
  };
}
