
import { useState, useEffect, useCallback } from 'react';
import { NetworkQuality } from './useNetworkQuality';
import { useLocalStorage } from '../useLocalStorage';

export function useCachedData(isOnline: boolean, networkQuality: NetworkQuality) {
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();

  // Initialize lastSyncTime from localStorage on mount
  useEffect(() => {
    const storedSyncTime = localStorage.getItem('habits_last_sync_time');
    if (storedSyncTime) {
      setLastSyncTime(parseInt(storedSyncTime, 10));
    }
  }, []);

  // Save lastSyncTime to localStorage whenever it changes
  useEffect(() => {
    if (lastSyncTime) {
      localStorage.setItem('habits_last_sync_time', lastSyncTime.toString());
    }
  }, [lastSyncTime]);

  // Decide if we should skip network requests based on conditions
  const shouldSkipNetworkRequest = useCallback(() => {
    if (!isOnline) return true;
    
    // If network is poor and we have recent data (within 15 minutes), use cache
    if (networkQuality === 'poor' && lastSyncTime && (Date.now() - lastSyncTime < 15 * 60 * 1000)) {
      return true;
    }
    
    return false;
  }, [isOnline, networkQuality, lastSyncTime]);

  return {
    shouldSkipNetworkRequest,
    loadOfflineHabits,
    saveOfflineHabits,
    lastSyncTime,
    setLastSyncTime
  };
}
