
import { useState, useEffect } from "react";
import { useOnlineStatus } from "./useOnlineStatus";
import { useDetailedConnectionStatus } from "./useOnlineStatus";
import { NetworkQuality } from "./network/networkTypes";

// Constants for better stale time management
export const STALE_TIME = {
  DEFAULT: 30000,         // 30 seconds
  EXTENDED: 5 * 60 * 1000 // 5 minutes when network is slow/unstable
};

export function useNetworkQuality() {
  const isOnline = useOnlineStatus();
  const connectionDetails = useDetailedConnectionStatus();
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(
    !isOnline ? 'offline' : connectionDetails.quality
  );

  // Update network quality when connection details change
  useEffect(() => {
    setNetworkQuality(
      !isOnline ? 'offline' : connectionDetails.quality
    );
  }, [isOnline, connectionDetails]);

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
