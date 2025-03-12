
import { useState, useEffect } from 'react';
import { trackNetworkChange } from '@/lib/analytics/networkTracking';

export function useNetworkEvents() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  
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
  
  return { isOnline };
}
