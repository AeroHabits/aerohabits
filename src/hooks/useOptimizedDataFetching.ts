
import { useState, useEffect, useCallback, useRef } from "react";
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
  const initialFetchTimeRef = useRef<number>(Date.now());
  
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
  
  // The optimized query function with better caching behaviors
  const optimizedQueryFn = useCallback(async () => {
    // If we're in cache-only mode, only use the cache
    if (cachePolicy === 'cache-only') {
      const cached = getCachedData();
      if (cached) return cached;
      throw new Error('No cached data available and cache-only policy is set');
    }
    
    // For network-first and network-only when offline, attempt to use cache
    if (!isOnline && (cachePolicy === 'network-first' || cachePolicy === 'network-only')) {
      const cached = getCachedData();
      if (cached) return cached;
      if (cachePolicy === 'network-only') {
        throw new Error('No network connection and cache not allowed for this request');
      }
    }
    
    // Performance optimization for rapid successive queries (debounce)
    const now = Date.now();
    if (
      lastSuccessfulFetch && 
      (now - lastSuccessfulFetch < 2000) && 
      cachePolicy !== 'network-only'
    ) {
      const cached = getCachedData();
      if (cached) {
        console.log(`Using cache due to recent fetch for ${queryKey.join(',')}`);
        return cached;
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
      if (cachePolicy !== 'network-only') {
        const cached = getCachedData();
        if (cached) {
          console.log(`Falling back to cached data for ${queryKey.join(',')}`);
          return cached;
        }
      }
      
      throw error;
    }
  }, [queryFn, cachePolicy, isOnline, getCachedData, saveDataToCache, queryKey, lastSuccessfulFetch]);
  
  // Fix: Use a function that returns the right type to satisfy React Query's typing requirements
  const getPlaceholderDataFn = useCallback(() => {
    return prepareInitialData() as any;
  }, [prepareInitialData]);

  // Create query options with correct typing
  const queryOptions: UseQueryOptions<T, Error, T, string[]> = {
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime: computeStaleTime(),
    retry: (failureCount, error) => {
      if (!isOnline && getCachedData()) return false;
      if (failureCount >= retryCount) return false;
      if (isNative && networkQuality === 'poor' && failureCount >= 1) return false;
      return true;
    },
    retryDelay: attempt => Math.min(1000 * Math.pow(2, attempt), 30000),
    refetchOnWindowFocus: networkQuality === 'good' && !isNative,
    refetchInterval: false
  };
  
  // Only add placeholder data if we have something to provide
  const initialDataValue = prepareInitialData();
  if (initialDataValue !== undefined) {
    // Use the function to satisfy TypeScript's requirements
    queryOptions.placeholderData = getPlaceholderDataFn;
  }
  
  const queryResult = useQuery(queryOptions);
  
  useEffect(() => {
    if (queryResult.isSuccess && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [queryResult.isSuccess, isFirstLoad]);
  
  useEffect(() => {
    // Only attempt reconnection refetch if we've been online for at least 3 seconds
    // and the page has been loaded for more than 5 seconds
    const now = Date.now();
    if (
      isOnline && 
      queryResult.isError && 
      !queryResult.isFetching &&
      now - initialFetchTimeRef.current > 5000
    ) {
      // Use a small delay before attempting to refetch
      const timer = setTimeout(() => {
        queryResult.refetch();
      }, 2000);
      
      return () => clearTimeout(timer);
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
