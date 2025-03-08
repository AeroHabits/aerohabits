
import { useState, useEffect } from "react";
import { useOnlineStatus } from "./useOnlineStatus";

// Network quality types
export type NetworkQuality = 'good' | 'poor' | 'offline';

// Constants for better stale time management
export const STALE_TIME = {
  DEFAULT: 30000,         // 30 seconds
  EXTENDED: 5 * 60 * 1000 // 5 minutes when network is slow/unstable
};

export function useNetworkQuality() {
  const isOnline = useOnlineStatus();
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(getNetworkQuality());

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

  // Update network quality when online status changes
  useEffect(() => {
    setNetworkQuality(getNetworkQuality());
    
    // Setup periodic network quality check
    const intervalId = setInterval(() => {
      setNetworkQuality(getNetworkQuality());
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [isOnline]);

  // Determine appropriate stale time based on network conditions
  const getStaleTime = () => {
    if (networkQuality === 'poor') {
      return STALE_TIME.EXTENDED;
    }
    return STALE_TIME.DEFAULT;
  };

  return {
    networkQuality,
    isOnline,
    getStaleTime,
    shouldSkipNetworkRequest: (lastSyncTime: number | null) => {
      if (!isOnline) return true;
      
      // If network is poor and we have recent data (within 15 minutes), use cache
      if (networkQuality === 'poor' && lastSyncTime && (Date.now() - lastSyncTime < 15 * 60 * 1000)) {
        return true;
      }
      
      return false;
    }
  };
}
