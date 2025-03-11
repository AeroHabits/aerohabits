
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, QueryFunction, UseQueryOptions } from "@tanstack/react-query";
import { Capacitor } from '@capacitor/core';
import { useCachePolicy, CachePolicy } from "./useCachePolicy";
import { useCacheOperations } from "./useCacheOperations";
import { useOptimizedQueryFn } from "./useOptimizedQueryFn";
import { useRetryStrategy } from "./useRetryStrategy";

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
  const { getCachedData, saveDataToCache } = useCacheOperations<T>({ queryKey, criticalData });
  const { networkQuality, isOnline, computeStaleTime } = useCachePolicy({ cachePolicy, staleTime });
  const optimizedQueryFn = useOptimizedQueryFn<T>({ queryKey, queryFn, cachePolicy, criticalData });
  const { retryStrategy, retryDelay, shouldRefetchOnWindowFocus } = useRetryStrategy({ 
    retryCount, 
    getCachedData 
  });
  
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<number | null>(null);
  const isNative = Capacitor.isNativePlatform();
  const initialFetchTimeRef = useRef<number>(Date.now());
  
  // Prepare initial data from cache if appropriate
  const prepareInitialData = useCallback((): T | undefined => {
    if (initialData) return initialData;
    
    if (cachePolicy === 'cache-first' || cachePolicy === 'cache-only') {
      const cached = getCachedData();
      if (cached) return cached;
    }
    
    return placeholderData;
  }, [cachePolicy, getCachedData, initialData, placeholderData]);
  
  // Create query options with correct typing
  const queryOptions: UseQueryOptions<T, Error, T, string[]> = {
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime: computeStaleTime(),
    retry: retryStrategy,
    retryDelay: retryDelay,
    refetchOnWindowFocus: shouldRefetchOnWindowFocus,
    refetchInterval: false
  };
  
  // Add placeholder or initial data if needed
  if (placeholderData !== undefined || initialData !== undefined) {
    // Using a function for placeholderData to avoid type errors
    // React Query v5 is more strict about typing here
    queryOptions.placeholderData = prepareInitialData;
  }
  
  const queryResult = useQuery<T, Error, T, string[]>(queryOptions);
  
  useEffect(() => {
    if (queryResult.isSuccess && isFirstLoad) {
      setIsFirstLoad(false);
    }
    
    if (queryResult.isSuccess) {
      setLastSuccessfulFetch(Date.now());
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
