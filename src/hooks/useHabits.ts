
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useHabitOperations } from "./useHabitOperations";
import { useOfflineSync } from "./useOfflineSync";
import { useLocalStorage } from "./useLocalStorage";

// Constants for better stale time management
const STALE_TIME = {
  DEFAULT: 30000,         // 30 seconds
  EXTENDED: 5 * 60 * 1000 // 5 minutes when network is slow/unstable
};

// Network quality detection
const getNetworkQuality = (): 'good' | 'poor' | 'offline' => {
  if (!navigator.onLine) return 'offline';
  
  // If available, use the connection API to determine network quality
  if ('connection' in navigator && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
      return 'poor';
    }
  }
  
  return 'good';
};

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { deleteHabit, toggleHabit, addHabit, isOnline } = useHabitOperations();
  const { debouncedSync, isSyncing } = useOfflineSync();
  const { loadOfflineHabits, saveOfflineHabits, IMPORTANCE_LEVELS } = useLocalStorage();
  const [networkQuality, setNetworkQuality] = useState<'good' | 'poor' | 'offline'>(getNetworkQuality());
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  // Update network quality when online status changes
  useEffect(() => {
    setNetworkQuality(getNetworkQuality());
    
    // Setup periodic network quality check
    const intervalId = setInterval(() => {
      setNetworkQuality(getNetworkQuality());
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [isOnline]);

  // Determine appropriate stale time based on network conditions
  const getStaleTime = useCallback(() => {
    if (networkQuality === 'poor') {
      return STALE_TIME.EXTENDED;
    }
    return STALE_TIME.DEFAULT;
  }, [networkQuality]);

  // Decide if we should skip network requests based on conditions
  const shouldSkipNetworkRequest = useCallback(() => {
    if (!isOnline) return true;
    
    // If network is poor and we have recent data (within 15 minutes), use cache
    if (networkQuality === 'poor' && lastSyncTime && (Date.now() - lastSyncTime < 15 * 60 * 1000)) {
      return true;
    }
    
    return false;
  }, [isOnline, networkQuality, lastSyncTime]);

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
    retry: (failureCount, error) => {
      // Implement progressive retry strategy
      if (failureCount >= 3) return false;
      if (!isOnline) return false;
      
      // If network conditions are poor, limit retries
      if (networkQuality === 'poor' && failureCount >= 1) {
        return false;
      }
      
      return true;
    },
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
    networkQuality,
    isSyncing
  };
}
