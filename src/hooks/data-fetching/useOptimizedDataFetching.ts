
import {
  useQuery,
  QueryFunction,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNetworkQuality, NetworkQuality } from "../useNetworkQuality";
import { useOnlineStatus } from "../useOnlineStatus";

type NonFunctionGuard<T> = T extends Function ? never : T;

// Custom hook to generate optimized query function based on cache policy
function useOptimizedQueryFn<T>({
  queryFn,
  cachePolicy,
  networkTimeout,
  isOnline
}: {
  queryFn: QueryFunction<T, string[]>;
  cachePolicy: 'cache-first' | 'network-first' | 'network-only';
  networkTimeout: number;
  isOnline: boolean;
}) {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  return useMemo(() => {
    const optimizedQueryFn: QueryFunction<T, string[]> = async (context) => {
      return new Promise(async (resolve, reject) => {
        let timeout = false;

        // Start network timeout timer
        if (cachePolicy !== 'cache-first') {
          timeoutIdRef.current = setTimeout(() => {
            timeout = true;
            console.warn(`Network request timed out after ${networkTimeout}ms`);
            reject(new Error('Network timeout'));
          }, networkTimeout);
        }

        try {
          const result = await queryFn(context);
          if (!timeout) {
            clearTimeout(timeoutIdRef.current!);
            resolve(result);
          }
        } catch (error) {
          if (!timeout) {
            clearTimeout(timeoutIdRef.current!);
            reject(error);
          }
        }
      });
    };
    return optimizedQueryFn;
  }, [queryFn, cachePolicy, networkTimeout]);
}

// Custom hook to determine retry strategy based on network and data importance
function useRetryStrategy({
  retryCount,
  networkQuality,
  isOnline,
  criticalData
}: {
  retryCount: number;
  networkQuality: NetworkQuality;
  isOnline: boolean;
  criticalData: boolean;
}) {
  return useCallback((failureCount: number, error: any): boolean => {
    if (!isOnline) return false;
    if (criticalData && failureCount < 1) return true;
    if (networkQuality === 'poor' && failureCount > 1) return false;
    return failureCount < retryCount;
  }, [retryCount, networkQuality, isOnline, criticalData]);
}

export function useOptimizedDataFetching<T>({
  queryKey,
  queryFn,
  criticalData = false,
  staleTime = 300000, // 5 minutes
  cachePolicy = 'cache-first',
  retryCount = 2,
  networkTimeout = 10000,
  enabled = true,
  onSuccess,
  onError,
}: {
  queryKey: string[];
  queryFn: QueryFunction<T, string[]>;
  criticalData?: boolean;
  staleTime?: number;
  cachePolicy?: 'cache-first' | 'network-first' | 'network-only';
  retryCount?: number;
  networkTimeout?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();
  const { networkQuality } = useNetworkQuality();
  const isOnline = useOnlineStatus();

  // Get optimized query configuration
  const optimizedQueryFn = useOptimizedQueryFn<T>({
    queryFn,
    cachePolicy,
    networkTimeout,
    isOnline: navigator.onLine && isOnline
  });

  // Calculate stale time based on network quality and cache policy
  const optimizedStaleTime = useMemo(() => {
    if (cachePolicy === 'network-only') return 0;
    if (!isOnline) return Infinity;
    
    switch (networkQuality) {
      case 'poor': return staleTime * 3; // Extend stale time for poor connection
      case 'good': return staleTime;
      case 'offline': return Infinity;
      default: return staleTime;
    }
  }, [staleTime, networkQuality, cachePolicy, isOnline]);

  // Configure retry strategy
  const retryStrategy = useRetryStrategy({
    retryCount,
    networkQuality,
    isOnline,
    criticalData
  });

  // Use the query with updated configuration for React Query v5
  const queryOptions: UseQueryOptions<T, Error, NonFunctionGuard<T>, string[]> = {
    queryKey,
    queryFn: optimizedQueryFn,
    staleTime: optimizedStaleTime,
    placeholderData: (previousData: T | undefined) => previousData as NonFunctionGuard<T> | undefined,
    retry: retryStrategy,
    enabled: enabled && (cachePolicy !== 'network-only' || isOnline),
    refetchOnWindowFocus: networkQuality !== 'poor',
    refetchOnReconnect: true,
    gcTime: optimizedStaleTime * 2
  };

  // In React Query v5, we need to handle callbacks differently
  if (onSuccess) {
    queryOptions.select = (data: T) => {
      onSuccess(data);
      return data as NonFunctionGuard<T>;
    };
  }

  if (onError) {
    // React Query v5 compatible error handling
    queryOptions.meta = {
      ...queryOptions.meta,
      onError
    };
  }

  const result = useQuery<T, Error, NonFunctionGuard<T>, string[]>(queryOptions);

  // We need to manually call the onError callback since it's in the meta
  useEffect(() => {
    if (result.error && onError) {
      onError(result.error);
    }
  }, [result.error, onError]);

  // Custom refetch function to bypass cache if needed
  const refetchOptimized = useCallback(async () => {
    try {
      await result.refetch();
    } catch (error) {
      console.error("Refetch failed:", error);
    }
  }, [result.refetch]);

  return {
    ...result,
    networkQuality,
    isOnline,
    refetchOptimized
  };
}
