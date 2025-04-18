import { useState, useCallback } from "react";
import { Habit, Goal, Challenge } from "@/types";

const STORAGE_KEYS = {
  HABITS: 'offlineHabits',
  GOALS: 'offlineGoals',
  CHALLENGES: 'offlineChallenges',
  SYNC_QUEUE: 'syncQueue',
  CACHE_STATS: 'cacheStats'
} as const;

const IMPORTANCE_LEVELS = {
  CRITICAL: 3,
  HIGH: 2,
  NORMAL: 1,
  LOW: 0
};

const getTTL = (importance: number) => {
  switch (importance) {
    case IMPORTANCE_LEVELS.CRITICAL:
      return 7 * 24 * 60 * 60 * 1000;
    case IMPORTANCE_LEVELS.HIGH:
      return 3 * 24 * 60 * 60 * 1000;
    case IMPORTANCE_LEVELS.NORMAL:
      return 24 * 60 * 60 * 1000;
    case IMPORTANCE_LEVELS.LOW:
      return 6 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
};

interface CacheStats {
  [key: string]: {
    accessCount: number;
    lastAccessed: number;
  };
}

export function useLocalStorage() {
  // iOS detection
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const updateCacheStats = useCallback((key: string) => {
    try {
      // Skip stats tracking on iOS for better performance unless in development
      if (isIOS && process.env.NODE_ENV !== 'development') return;

      const statsJson = localStorage.getItem(STORAGE_KEYS.CACHE_STATS);
      const stats: CacheStats = statsJson ? JSON.parse(statsJson) : {};
      
      stats[key] = {
        accessCount: (stats[key]?.accessCount || 0) + 1,
        lastAccessed: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEYS.CACHE_STATS, JSON.stringify(stats));
    } catch (e) {
      // Silent error in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating cache stats:', e);
      }
    }
  }, [isIOS]);

  const cleanupCache = useCallback(() => {
    try {
      // Run cleanup less frequently on iOS
      if (isIOS && Math.random() > 0.02) return; // 2% chance on iOS vs 5% normally

      const statsJson = localStorage.getItem(STORAGE_KEYS.CACHE_STATS);
      if (!statsJson) return;
      
      const stats: CacheStats = JSON.parse(statsJson);
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      Object.entries(stats).forEach(([key, stat]) => {
        // More conservative cleanup on iOS - only remove really old or unused items
        const threshold = isIOS ? 2 : 5; // Higher threshold for iOS
        if (stat.lastAccessed < oneWeekAgo && stat.accessCount < threshold) {
          localStorage.removeItem(key);
          delete stats[key];
        }
      });
      
      localStorage.setItem(STORAGE_KEYS.CACHE_STATS, JSON.stringify(stats));
    } catch (e) {
      // Silent error in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Error cleaning up cache:', e);
      }
    }
  }, [isIOS]);

  // Less frequent cleanup for iOS
  if (!isIOS && Math.random() < 0.05 || isIOS && Math.random() < 0.02) {
    cleanupCache();
  }

  const loadFromStorage = useCallback(<T>(key: string, importance: number = IMPORTANCE_LEVELS.NORMAL): T | null => {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    try {
      const { data, timestamp, originalImportance } = JSON.parse(stored);
      const ttl = getTTL(originalImportance || importance);
      
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }
      
      updateCacheStats(key);
      
      return data;
    } catch {
      return null;
    }
  }, [updateCacheStats]);

  const saveToStorage = useCallback(<T>(key: string, data: T, importance: number = IMPORTANCE_LEVELS.NORMAL) => {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      originalImportance: importance
    }));
    
    updateCacheStats(key);
  }, [updateCacheStats]);

  const loadOfflineHabits = useCallback(() => 
    loadFromStorage<Habit[]>(STORAGE_KEYS.HABITS, IMPORTANCE_LEVELS.CRITICAL) || [], [loadFromStorage]);
  
  const saveOfflineHabits = useCallback((habits: Habit[]) => 
    saveToStorage(STORAGE_KEYS.HABITS, habits, IMPORTANCE_LEVELS.CRITICAL), [saveToStorage]);
  
  const loadOfflineGoals = useCallback(() => 
    loadFromStorage<Goal[]>(STORAGE_KEYS.GOALS, IMPORTANCE_LEVELS.HIGH) || [], [loadFromStorage]);
  
  const saveOfflineGoals = useCallback((goals: Goal[]) => 
    saveToStorage(STORAGE_KEYS.GOALS, goals, IMPORTANCE_LEVELS.HIGH), [saveToStorage]);
  
  const loadOfflineChallenges = useCallback(() => 
    loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, IMPORTANCE_LEVELS.NORMAL) || [], [loadFromStorage]);
  
  const saveOfflineChallenges = useCallback((challenges: Challenge[]) => 
    saveToStorage(STORAGE_KEYS.CHALLENGES, challenges, IMPORTANCE_LEVELS.NORMAL), [saveToStorage]);

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
