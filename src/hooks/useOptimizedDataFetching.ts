
import { useState, useEffect, useCallback } from "react";
import { useQuery, QueryFunction, UseQueryOptions } from "@tanstack/react-query";
import { useNetworkQuality } from "./useNetworkQuality";
import { useLocalStorage } from "./useLocalStorage";
import { Capacitor } from '@capacitor/core';

type CachePolicy = 'network-first' | 'cache-first' | 'cache-only' | 'network-only';

interface OptimizedQueryOptions<T> {
  queryKey: string[];
  queryFn: QueryFunction<T>;
  cachePolicy?: CachePolicy;
  staleTime?: number;
  retryCount?: number;
  placeholderData?: T;
  criticalData?: boolean;
  initialData?: T;
}

export function useOptimizedDataFetching<T>({
  queryKey,
  queryFn,
  cachePolicy = 'network-first',
  staleTime,
  retryCount = 3,
  placeholderData,
  criticalData = false,
  initialData
}: OptimizedQueryOptions<T>) {
  const { networkQuality, isOnline } = useNetworkQuality();
  const { loadFromStorage, saveToStorage, IMPORTANCE_LEVELS } = useLocalStorage();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<number | null>(null);
  const isNative = Capacitor.isNativePlatform();
  
  // Compute optimized stale time based on platform and network conditions
  const computeStaleTime = useCallback(() => {
    const baseStaleTime = staleTime || 30000; // 30 seconds default
    
    if (!isOnline) {
      return baseStaleTime * 3; // Triple stale time when offline
    }
    
    if (networkQuality === 'poor') {
      return baseStaleTime * 2; // Double stale time on poor network
    }
    
    if (isNative) {
      // On native platforms, we're more conservative with refetching
      return baseStaleTime * 1.5;
    }
    
    return baseStaleTime;
  }, [staleTime, isOnline, networkQuality, isNative]);
  
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
    setLastSuccessfulFetch(Date.now());
  }, [queryKey, criticalData, saveToStorage, IMPORTANCE_LEVELS]);
  
  // Prepare initial data from cache if appropriate
  const prepareInitialData = useCallback(() => {
    if (initialData) return initialData;
    
    if (cachePolicy === 'cache-first' || cachePolicy === 'cache-only') {
      const cached = getCachedData();
      if (cached) return cached;
    }
    
    return placeholderData;
  }, [cachePolicy, getCachedData, initialData, placeholderData]);
  
  // The optimized query function
  const optimizedQueryFn = useCallback(async () => {
    // For cache-only, don't even try network
    if (cachePolicy === 'cache-only') {
      const cached = getCachedData();
      if (cached) return cached;
      throw new Error('No cached data available and cache-only policy is set');
    }
    
    // For offline mode with network-first or network-only, use cache or throw if no cache
    if (!isOnline && (cachePolicy === 'network-first' || cachePolicy === 'network-only')) {
      const cached = getCachedData();
      if (cached) return cached;
      if (cachePolicy === 'network-only') {
        throw new Error('No network connection and cache not allowed for this request');
      }
    }
    
    // Normal flow - try network
    try {
      // Add performance measurement for development
      const startTime = performance.now();
      const result = await queryFn();
      const endTime = performance.now();
      
      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Query ${queryKey.join(',')} took ${(endTime - startTime).toFixed(2)}ms`);
      }
      
      // Save successful result to cache
      saveDataToCache(result);
      return result;
    } catch (error) {
      console.error(`Error fetching data for ${queryKey.join(',')}: `, error);
      
      // On error, try to fall back to cache
      if (cachePolicy !== 'network-only') {
        const cached = getCachedData();
        if (cached) {
          console.log(`Falling back to cached data for ${queryKey.join(',')}`);
          return cached;
        }
      }
      
      // No fallback available
      throw error;
    }
  }, [queryFn, cachePolicy, isOnline, getCachedData, saveDataToCache, queryKey]);
  
  // Setup the optimized React Query hook
  const queryResult = useQuery({
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime: computeStaleTime(),
    placeholderData: prepareInitialData() as any, // Fixed to resolve type issue
    retry: (failureCount, error) => {
      // Don't retry on offline if we already returned cached data
      if (!isOnline && getCachedData()) return false;
      
      // Don't retry more than configured amount
      if (failureCount >= retryCount) return false;
      
      // On mobile with poor network, limit retries to reduce battery usage
      if (isNative && networkQuality === 'poor' && failureCount >= 1) {
        return false;
      }
      
      return true;
    },
    retryDelay: attempt => Math.min(1000 * Math.pow(2, attempt), 30000), // Exponential backoff with max 30 sec
    refetchOnWindowFocus: networkQuality === 'good' && !isNative, // Only refetch on focus for good connections and not on mobile
    refetchInterval: false, // We'll manage our own refetch strategy
  });
  
  // Effect to mark first load as complete
  useEffect(() => {
    if (queryResult.isSuccess && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [queryResult.isSuccess, isFirstLoad]);
  
  // Effect to retry on network reconnection if we have errors
  useEffect(() => {
    if (isOnline && queryResult.isError && !queryResult.isFetching) {
      queryResult.refetch();
    }
  }, [isOnline, queryResult]);
  
  return {
    ...queryResult,
    isInitialLoading: isFirstLoad && queryResult.isLoading,
    networkQuality,
    isOnline,
    refetchOptimized: queryResult.refetch
  };
}
