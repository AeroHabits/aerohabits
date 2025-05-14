
import { useState, useEffect } from 'react';
import { trackNetworkChange } from '@/lib/analytics/networkTracking';

export function useNetworkEvents() {
  // Initialize with current online status, but only in browser environment
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? window.navigator.onLine : true
  );
  
  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return;
    
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
  
  return { isOnline };
}
