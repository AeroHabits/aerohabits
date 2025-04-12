
import { useState, useEffect, useCallback } from 'react';

// Constants for better stale time management
export const STALE_TIME = {
  DEFAULT: 30000,         // 30 seconds
  EXTENDED: 5 * 60 * 1000 // 5 minutes when network is slow/unstable
};

// Network quality detection types
export type NetworkQuality = 'good' | 'poor' | 'offline';

export function useNetworkQuality(isOnline: boolean) {
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(getNetworkQuality());
  
  // Update network quality when online status changes
  useEffect(() => {
    setNetworkQuality(getNetworkQuality());
    
    // Setup periodic network quality check
    const intervalId = setInterval(() => {
      setNetworkQuality(getNetworkQuality());
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [isOnline]);

  return {
    networkQuality,
    getStaleTime: useCallback(() => {
      if (networkQuality === 'poor') {
        return STALE_TIME.EXTENDED;
      }
      return STALE_TIME.DEFAULT;
    }, [networkQuality])
  };
}

// Helper function to detect network quality
export const getNetworkQuality = (): NetworkQuality => {
  if (!navigator.onLine) return 'offline';
  
  // If available, use the connection API to determine network quality
  if ('connection' in navigator && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
      return 'poor';
    }
  }
  
  return 'good';
};
