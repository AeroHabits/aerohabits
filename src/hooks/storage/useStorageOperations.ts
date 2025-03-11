
import { useCallback } from "react";
import { memoryCache, getTTL, IMPORTANCE_LEVELS } from "./storageConstants";
import { useCacheManagement } from "./useCacheManagement";

export function useStorageOperations() {
  const { updateCacheStats, cleanupCache } = useCacheManagement();

  // Run cleanup very infrequently (1% chance on hook initialization)
  if (Math.random() < 0.01) {
    cleanupCache();
  }

  // Load data from storage with TTL handling
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

  // Save data to storage with TTL information
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

  return {
    loadFromStorage,
    saveToStorage,
    IMPORTANCE_LEVELS
  };
}
