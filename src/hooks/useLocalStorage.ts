
import { useState, useRef, useCallback } from "react";
import { Habit, Goal, Challenge } from "@/types";

const STORAGE_KEYS = {
  HABITS: 'offlineHabits',
  GOALS: 'offlineGoals',
  CHALLENGES: 'offlineChallenges',
  SYNC_QUEUE: 'syncQueue',
  CACHE_STATS: 'cacheStats',
  LAST_CLEANUP: 'lastCacheCleanup'
} as const;

const IMPORTANCE_LEVELS = {
  CRITICAL: 3, // User-specific data that must be preserved
  HIGH: 2,     // Important app data
  NORMAL: 1,   // Regular content
  LOW: 0       // Easily regenerated content
};

// Cache for in-memory storage to reduce localStorage reads
const memoryCache = new Map<string, any>();

const getTTL = (importance: number) => {
  switch (importance) {
    case IMPORTANCE_LEVELS.CRITICAL:
      return 7 * 24 * 60 * 60 * 1000; // 7 days
    case IMPORTANCE_LEVELS.HIGH:
      return 3 * 24 * 60 * 60 * 1000; // 3 days
    case IMPORTANCE_LEVELS.NORMAL:
      return 24 * 60 * 60 * 1000;     // 24 hours
    case IMPORTANCE_LEVELS.LOW:
      return 6 * 60 * 60 * 1000;      // 6 hours
    default:
      return 24 * 60 * 60 * 1000;     // Default: 24 hours
  }
};

interface CacheStats {
  [key: string]: {
    accessCount: number;
    lastAccessed: number;
  };
}

export function useLocalStorage() {
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
          memoryCache.delete(key);
        }
      });
      
      cacheStatsRef.current = stats;
      localStorage.setItem(STORAGE_KEYS.CACHE_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error cleaning up cache:', e);
    }
  }, [getCacheStats]);

  // Run cleanup very infrequently
  if (Math.random() < 0.01) {
    cleanupCache();
  }

  // Modified to accept an optional third parameter for compatibility
  const loadFromStorage = useCallback(<T>(key: string, importance: number = IMPORTANCE_LEVELS.NORMAL, _unused?: any): T | null => {
    // Check memory cache first
    if (memoryCache.has(key)) {
      const cachedItem = memoryCache.get(key);
      
      // Check if cached item is still valid
      if (cachedItem && cachedItem.timestamp && Date.now() - cachedItem.timestamp <= getTTL(cachedItem.originalImportance || importance)) {
        updateCacheStats(key);
        return cachedItem.data;
      } else {
        // If expired, remove from cache
        memoryCache.delete(key);
      }
    }
    
    // Fall back to localStorage
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    try {
      const parsedData = JSON.parse(stored);
      const { data, timestamp, originalImportance } = parsedData;
      const ttl = getTTL(originalImportance || importance);
      
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      updateCacheStats(key);
      
      // Add to memory cache for faster future access
      memoryCache.set(key, parsedData);
      
      return data;
    } catch {
      return null;
    }
  }, [updateCacheStats]);

  const saveToStorage = useCallback(<T>(key: string, data: T, importance: number = IMPORTANCE_LEVELS.NORMAL) => {
    const storageItem = {
      data,
      timestamp: Date.now(),
      originalImportance: importance
    };
    
    // Update memory cache first
    memoryCache.set(key, storageItem);
    
    // Then persist to localStorage
    localStorage.setItem(key, JSON.stringify(storageItem));
    
    updateCacheStats(key);
  }, [updateCacheStats]);

  const loadOfflineHabits = useCallback(() => 
    loadFromStorage<Habit[]>(STORAGE_KEYS.HABITS, IMPORTANCE_LEVELS.CRITICAL) || [],
  [loadFromStorage]);
  
  const saveOfflineHabits = useCallback((habits: Habit[]) => 
    saveToStorage(STORAGE_KEYS.HABITS, habits, IMPORTANCE_LEVELS.CRITICAL),
  [saveToStorage]);
  
  const loadOfflineGoals = useCallback(() => 
    loadFromStorage<Goal[]>(STORAGE_KEYS.GOALS, IMPORTANCE_LEVELS.HIGH) || [],
  [loadFromStorage]);
  
  const saveOfflineGoals = useCallback((goals: Goal[]) => 
    saveToStorage(STORAGE_KEYS.GOALS, goals, IMPORTANCE_LEVELS.HIGH),
  [saveToStorage]);
  
  const loadOfflineChallenges = useCallback(() => 
    loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, IMPORTANCE_LEVELS.NORMAL) || [],
  [loadFromStorage]);
  
  const saveOfflineChallenges = useCallback((challenges: Challenge[]) => 
    saveToStorage(STORAGE_KEYS.CHALLENGES, challenges, IMPORTANCE_LEVELS.NORMAL),
  [saveToStorage]);

  return {
    loadFromStorage,
    saveToStorage,
    loadOfflineHabits,
    saveOfflineHabits,
    loadOfflineGoals,
    saveOfflineGoals,
    loadOfflineChallenges,
    saveOfflineChallenges,
    IMPORTANCE_LEVELS
  };
}
