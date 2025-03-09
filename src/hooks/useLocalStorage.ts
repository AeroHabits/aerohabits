
import { useState } from "react";
import { Habit, Goal, Challenge } from "@/types";

const STORAGE_KEYS = {
  HABITS: 'offlineHabits',
  GOALS: 'offlineGoals',
  CHALLENGES: 'offlineChallenges',
  SYNC_QUEUE: 'syncQueue',
  CACHE_STATS: 'cacheStats'
} as const;

const IMPORTANCE_LEVELS = {
  CRITICAL: 3, // User-specific data that must be preserved
  HIGH: 2,     // Important app data
  NORMAL: 1,   // Regular content
  LOW: 0       // Easily regenerated content
};

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
  const updateCacheStats = (key: string) => {
    try {
      const statsJson = localStorage.getItem(STORAGE_KEYS.CACHE_STATS);
      const stats: CacheStats = statsJson ? JSON.parse(statsJson) : {};
      
      stats[key] = {
        accessCount: (stats[key]?.accessCount || 0) + 1,
        lastAccessed: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEYS.CACHE_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error updating cache stats:', e);
    }
  };

  const cleanupCache = () => {
    try {
      const statsJson = localStorage.getItem(STORAGE_KEYS.CACHE_STATS);
      if (!statsJson) return;
      
      const stats: CacheStats = JSON.parse(statsJson);
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      Object.entries(stats).forEach(([key, stat]) => {
        if (stat.lastAccessed < oneWeekAgo && stat.accessCount < 5) {
          localStorage.removeItem(key);
          delete stats[key];
        }
      });
      
      localStorage.setItem(STORAGE_KEYS.CACHE_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error cleaning up cache:', e);
    }
  };

  if (Math.random() < 0.05) {
    cleanupCache();
  }

  // Modified to accept an optional third parameter for compatibility
  const loadFromStorage = <T>(key: string, importance: number = IMPORTANCE_LEVELS.NORMAL, _unused?: any): T | null => {
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
  };

  const saveToStorage = <T>(key: string, data: T, importance: number = IMPORTANCE_LEVELS.NORMAL) => {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      originalImportance: importance
    }));
    
    updateCacheStats(key);
  };

  const loadOfflineHabits = () => 
    loadFromStorage<Habit[]>(STORAGE_KEYS.HABITS, IMPORTANCE_LEVELS.CRITICAL) || [];
  
  const saveOfflineHabits = (habits: Habit[]) => 
    saveToStorage(STORAGE_KEYS.HABITS, habits, IMPORTANCE_LEVELS.CRITICAL);
  
  const loadOfflineGoals = () => 
    loadFromStorage<Goal[]>(STORAGE_KEYS.GOALS, IMPORTANCE_LEVELS.HIGH) || [];
  
  const saveOfflineGoals = (goals: Goal[]) => 
    saveToStorage(STORAGE_KEYS.GOALS, goals, IMPORTANCE_LEVELS.HIGH);
  
  const loadOfflineChallenges = () => 
    loadFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, IMPORTANCE_LEVELS.NORMAL) || [];
  
  const saveOfflineChallenges = (challenges: Challenge[]) => 
    saveToStorage(STORAGE_KEYS.CHALLENGES, challenges, IMPORTANCE_LEVELS.NORMAL);

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
