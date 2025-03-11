
import { useState, useEffect, useCallback, useRef } from "react";
import { useOnlineStatus } from "./useOnlineStatus";

// Network quality types
export type NetworkQuality = 'good' | 'poor' | 'offline';

// Constants for better stale time management
export const STALE_TIME = {
  DEFAULT: 60000,          // 1 minute (increased from 30 seconds)
  EXTENDED: 10 * 60 * 1000 // 10 minutes when network is slow/unstable (increased from 5 minutes)
};

export function useNetworkQuality() {
  const isOnline = useOnlineStatus();
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(getNetworkQuality());
  const lastQualityCheckTime = useRef<number>(Date.now());
  const checkIntervalRef = useRef<number | null>(null);

  // Get network quality
  function getNetworkQuality(): NetworkQuality {
    if (!navigator.onLine) return 'offline';
    
    // If available, use the connection API to determine network quality
    if ('connection' in navigator && (navigator as any).connection) {
      const conn = (navigator as any).connection;
      if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
        return 'poor';
      }
    }
    
    return 'good';
  }

  // Update network quality when online status changes - with throttling
  useEffect(() => {
    // Only update if it's been more than 10 seconds since last check
    const now = Date.now();
    if (now - lastQualityCheckTime.current > 10000) {
      setNetworkQuality(getNetworkQuality());
      lastQualityCheckTime.current = now;
    }
    
    // Cleanup previous interval if exists
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
    
    // Setup periodic network quality check with adaptive frequency
    // Based on current quality and platform
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const intervalTime = isIOS 
      ? (networkQuality === 'good' ? 120000 : 180000) // 2-3 minutes on iOS to save battery
      : (networkQuality === 'good' ? 60000 : 90000);  // 1-1.5 minutes on other platforms
      
    checkIntervalRef.current = window.setInterval(() => {
      if (isOnline) {
        setNetworkQuality(getNetworkQuality());
        lastQualityCheckTime.current = Date.now();
      }
    }, intervalTime);
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [isOnline, networkQuality]);

  // Determine appropriate stale time based on network conditions
  const getStaleTime = useCallback(() => {
    if (networkQuality === 'poor') {
      return STALE_TIME.EXTENDED;
    }
    return STALE_TIME.DEFAULT;
  }, [networkQuality]);

  return {
    networkQuality,
    isOnline,
    getStaleTime,
    shouldSkipNetworkRequest: (lastSyncTime: number | null) => {
      if (!isOnline) return true;
      
      // If network is poor and we have recent data (extended to 30 minutes), use cache
      if (networkQuality === 'poor' && lastSyncTime && (Date.now() - lastSyncTime < 30 * 60 * 1000)) {
        return true;
      }
      
      return false;
    }
  };
}
