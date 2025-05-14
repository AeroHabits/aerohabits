
import { useConnectionQuality } from './network/useConnectionQuality';

// For backward compatibility, return isOnline boolean directly
export function useOnlineStatus() {
  // Guard against SSR/non-browser environments
  const isClient = typeof window !== 'undefined';
  
  // In non-browser environments, assume online
  if (!isClient) {
    return true;
  }
  
  const { isOnline } = useConnectionQuality();
  return isOnline;
}

// Export the hook that provides detailed connection info
export function useDetailedConnectionStatus() {
  // Guard against SSR/non-browser environments
  const isClient = typeof window !== 'undefined';
  
  // In non-browser environments, return fallback data
  if (!isClient) {
    return {
      isOnline: true,
      connectionDetails: {
        isOnline: true,
        latency: null,
        quality: 'good',
        downlinkSpeed: null,
        lastChecked: Date.now(),
        reliability: 100,
      }
    };
  }
  
  const { connectionDetails } = useConnectionQuality();
  return connectionDetails;
}
