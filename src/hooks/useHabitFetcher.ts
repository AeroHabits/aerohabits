
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNetworkQuality } from "./useNetworkQuality";
import { useLocalStorage } from "./useLocalStorage";
import { Habit } from "@/types";

export function useHabitFetcher() {
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();
  const { networkQuality, getStaleTime, shouldSkipNetworkRequest, isOnline } = useNetworkQuality();
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

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
        if (shouldSkipNetworkRequest(lastSyncTime)) {
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

  return {
    habits,
    isLoading,
    error,
    refetch,
    isFetching,
    networkQuality,
    isOnline,
    lastSyncTime
  };
}
