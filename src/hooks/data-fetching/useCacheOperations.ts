
import { useLocalStorage } from "../useLocalStorage";
import { useCallback } from "react";

interface CacheOperationsProps {
  queryKey: string[];
  criticalData?: boolean;
}

export function useCacheOperations<T>({ queryKey, criticalData = false }: CacheOperationsProps) {
  const { loadFromStorage, saveToStorage, IMPORTANCE_LEVELS } = useLocalStorage();
  
  // Get cached data with correct key
  const getCachedData = useCallback(() => {
    const storageKey = `query_${queryKey.join('_')}`;
    const importance = criticalData ? IMPORTANCE_LEVELS.CRITICAL : IMPORTANCE_LEVELS.NORMAL;
    return loadFromStorage<T>(storageKey, importance);
  }, [queryKey, criticalData, loadFromStorage, IMPORTANCE_LEVELS]);
  
  // Save data to cache
  const saveDataToCache = useCallback((data: T) => {
    const storageKey = `query_${queryKey.join('_')}`;
    const importance = criticalData ? IMPORTANCE_LEVELS.CRITICAL : IMPORTANCE_LEVELS.NORMAL;
    saveToStorage(storageKey, data, importance);
  }, [queryKey, criticalData, saveToStorage, IMPORTANCE_LEVELS]);

  return {
    getCachedData,
    saveDataToCache
  };
}
