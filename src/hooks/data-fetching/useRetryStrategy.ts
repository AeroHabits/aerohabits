
import { useCallback } from "react";
import { Capacitor } from '@capacitor/core';
import { useNetworkQuality } from "../useNetworkQuality";

interface RetryStrategyProps {
  retryCount: number;
  getCachedData: () => any | null;
}

export function useRetryStrategy({ retryCount, getCachedData }: RetryStrategyProps) {
  const { networkQuality, isOnline } = useNetworkQuality();
  const isNative = Capacitor.isNativePlatform();
  
  const retryStrategy = useCallback((failureCount: number) => {
    if (!isOnline && getCachedData()) return false;
    if (failureCount >= retryCount) return false;
    if (isNative && networkQuality === 'poor' && failureCount >= 1) return false;
    return true;
  }, [isOnline, getCachedData, retryCount, isNative, networkQuality]);
  
  const retryDelay = useCallback((attempt: number) => 
    Math.min(1000 * Math.pow(2, attempt), 30000), 
  []);
  
  return {
    retryStrategy,
    retryDelay,
    shouldRefetchOnWindowFocus: networkQuality === 'good' && !isNative
  };
}
