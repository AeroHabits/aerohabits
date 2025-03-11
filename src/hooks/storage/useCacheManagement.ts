
import { useCallback, useRef } from "react";
import { CacheStats, STORAGE_KEYS } from "./storageConstants";

export function useCacheManagement() {
  const cacheStatsRef = useRef<CacheStats | null>(null);
  const lastCleanupRef = useRef<number>(0);
  
  const getCacheStats = useCallback((): CacheStats => {
    if (cacheStatsRef.current === null) {
      try {
        const statsJson = localStorage.getItem(STORAGE_KEYS.CACHE_STATS);
        cacheStatsRef.current = statsJson ? JSON.parse(statsJson) : {};
      } catch (e) {
        console.error('Error loading cache stats:', e);
        cacheStatsRef.current = {};
      }
    }
    return cacheStatsRef.current;
  }, []);

  const updateCacheStats = useCallback((key: string) => {
    try {
      const stats = getCacheStats();
      
      stats[key] = {
        accessCount: (stats[key]?.accessCount || 0) + 1,
        lastAccessed: Date.now()
      };
      
      cacheStatsRef.current = stats;
      
      // Debounce writing to localStorage - only write every 10 accesses
      if (stats[key].accessCount % 10 === 0) {
        localStorage.setItem(STORAGE_KEYS.CACHE_STATS, JSON.stringify(stats));
      }
    } catch (e) {
      console.error('Error updating cache stats:', e);
    }
  }, [getCacheStats]);

  const cleanupCache = useCallback(() => {
    try {
      // Check if we've cleaned up recently (no more than once per hour)
      const now = Date.now();
      const lastCleanupTime = lastCleanupRef.current || parseInt(localStorage.getItem(STORAGE_KEYS.LAST_CLEANUP) || '0');
      
      if (now - lastCleanupTime < 60 * 60 * 1000) {
        return;
      }
      
      lastCleanupRef.current = now;
      localStorage.setItem(STORAGE_KEYS.LAST_CLEANUP, now.toString());
      
      const stats = getCacheStats();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      Object.entries(stats).forEach(([key, stat]) => {
        if (stat.lastAccessed < oneWeekAgo && stat.accessCount < 5) {
          localStorage.removeItem(key);
          delete stats[key];
        }
      });
      
      cacheStatsRef.current = stats;
      localStorage.setItem(STORAGE_KEYS.CACHE_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error cleaning up cache:', e);
    }
  }, [getCacheStats]);

  return {
    getCacheStats,
    updateCacheStats,
    cleanupCache
  };
}
