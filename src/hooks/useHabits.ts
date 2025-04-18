
import { useState, useEffect, useMemo } from "react";
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
          return loadOfflineHabits();
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return loadOfflineHabits();
        }

        // Simplified query to reduce overhead
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

        if (habitsError) {
          return loadOfflineHabits();
        }
        
        // Update last sync time for intelligent cache decisions
        setLastSyncTime(Date.now());
        
        // Save to offline storage with critical importance
        saveOfflineHabits(habitsData || []);
        return habitsData || [];
      } catch (error) {
        return loadOfflineHabits();
      }
    },
    retry: shouldRetry,
    staleTime: getStaleTime(),
    // Optimize background refreshes
    refetchOnWindowFocus: networkQuality === 'good',
    refetchInterval: networkQuality === 'good' ? 60000 : false,
    // Increase cache time for better performance
    gcTime: 5 * 60 * 1000,
  });

  // Only sync when really needed
  useEffect(() => {
    if (isOnline && !isSyncing) {
      // Adjust sync strategy based on network quality
      if (networkQuality === 'good') {
        debouncedSync();
      }
    }
  }, [isOnline, networkQuality, debouncedSync, isSyncing]);

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
    networkQuality,
    isSyncing
  };
}
