
import { useCallback } from "react";
import { QueryFunction } from "@tanstack/react-query";
import { useCacheOperations } from "./useCacheOperations";
import { useCachePolicy, CachePolicy } from "./useCachePolicy";

interface OptimizedQueryFnProps<T> {
  queryKey: string[];
  queryFn: QueryFunction<T>;
  cachePolicy: CachePolicy;
  criticalData?: boolean;
}

export function useOptimizedQueryFn<T>({
  queryKey,
  queryFn,
  cachePolicy,
  criticalData = false
}: OptimizedQueryFnProps<T>) {
  const { getCachedData, saveDataToCache } = useCacheOperations<T>({ queryKey, criticalData });
  const { 
    shouldUseCacheOnly, 
    shouldTryCache, 
    shouldFallbackToCache,
    isOnline 
  } = useCachePolicy({ cachePolicy, staleTime: 30000 });
  
  // The optimized query function with better caching behaviors
  const optimizedQueryFn = useCallback(async () => {
    // If we're in cache-only mode, only use the cache
    if (shouldUseCacheOnly) {
      const cached = getCachedData();
      if (cached) return cached;
      throw new Error('No cached data available and cache-only policy is set');
    }
    
    // For network-first and network-only when offline, attempt to use cache
    if (shouldTryCache) {
      const cached = getCachedData();
      if (cached) return cached;
      if (cachePolicy === 'network-only') {
        throw new Error('No network connection and cache not allowed for this request');
      }
    }
    
    // Attempt the network request
    try {
      // Measure performance
      const startTime = performance.now();
      const result = await queryFn();
      const endTime = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Query ${queryKey.join(',')} took ${(endTime - startTime).toFixed(2)}ms`);
      }
      
      saveDataToCache(result);
      return result;
    } catch (error) {
      console.error(`Error fetching data for ${queryKey.join(',')}: `, error);
      
      // For non-network-only policies, try the cache as fallback
      if (shouldFallbackToCache) {
        const cached = getCachedData();
        if (cached) {
          console.log(`Falling back to cached data for ${queryKey.join(',')}`);
          return cached;
        }
      }
      
      throw error;
    }
  }, [
    queryFn, 
    cachePolicy, 
    isOnline, 
    getCachedData, 
    saveDataToCache, 
    queryKey, 
    shouldUseCacheOnly, 
    shouldTryCache, 
    shouldFallbackToCache
  ]);

  return optimizedQueryFn;
}
