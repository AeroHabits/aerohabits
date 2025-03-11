
import { useCallback } from "react";
import { Capacitor } from '@capacitor/core';
import { useNetworkQuality } from "../useNetworkQuality";

export type CachePolicy = 'network-first' | 'cache-first' | 'cache-only' | 'network-only';

interface CachePolicyProps {
  cachePolicy: CachePolicy;
  staleTime?: number;
}

export function useCachePolicy({ cachePolicy, staleTime }: CachePolicyProps) {
  const { networkQuality, isOnline } = useNetworkQuality();
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

  return {
    computeStaleTime,
    shouldUseCacheOnly: cachePolicy === 'cache-only',
    shouldTryCache: !isOnline && (cachePolicy === 'network-first' || cachePolicy === 'network-only'),
    shouldFallbackToCache: cachePolicy !== 'network-only',
    isOnline,
    networkQuality
  };
}
