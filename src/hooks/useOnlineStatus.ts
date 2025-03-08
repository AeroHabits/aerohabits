
import { useState, useEffect } from 'react';
import { ConnectionStatus } from './network/networkTypes';
import { useConnectionQuality } from './network/useConnectionQuality';
import { trackNetworkChange } from '@/lib/analytics';

/**
 * Hook to check if the user is online
 * @returns boolean indicating if the user is online
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const connectionDetails = useConnectionQuality(isOnline);
  
  // Basic online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      trackNetworkChange('online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      trackNetworkChange('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // For backward compatibility, return isOnline boolean directly
  return isOnline;
}

// Export the hook that provides detailed connection info
export function useDetailedConnectionStatus(): ConnectionStatus {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const connectionDetails = useConnectionQuality(isOnline);
  
  // Basic online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return connectionDetails;
}
