
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
    
    // Check network quality periodically
    const checkInterval = 30000; // 30 seconds
    
    // Setup periodic network quality check
    const intervalId = setInterval(() => {
      // Check connection quality
      setNetworkQuality(getNetworkQuality());
    }, checkInterval);
    
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

// Helper function to detect network quality with multiple fallback mechanisms
export const getNetworkQuality = (): NetworkQuality => {
  // Primary check: offline status
  if (!navigator.onLine) return 'offline';
  
  // Secondary check: Connection API if available
  if ('connection' in navigator && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
      return 'poor';
    }
    
    // Also consider downlink speed if available
    if (typeof conn.downlink === 'number') {
      if (conn.downlink < 1.0) { // Less than 1 Mbps
        return 'poor';
      }
    }
  }
  
  // Default assessment for better performance
  return 'good';
};
