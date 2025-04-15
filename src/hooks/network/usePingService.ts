
import { useCallback } from 'react';
import { useErrorTracking } from '../useErrorTracking';

export function usePingService() {
  const { trackError } = useErrorTracking();
  
  // iOS-optimized ping function
  const pingEndpoint = useCallback(async (endpoint: string): Promise<number | null> => {
    // iOS detection
    const isIOS = typeof navigator !== 'undefined' && 
      (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    
    // Skip pings entirely on iOS for better performance
    if (isIOS) {
      // Return a fake consistent ping time
      return 100;
    }
    
    // Mobile optimization: Skip frequent checks on mobile devices
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      const lastPingTime = sessionStorage.getItem('last-ping-time');
      const now = Date.now();
      
      if (lastPingTime && (now - parseInt(lastPingTime)) < 120000) { // 2 minutes
        // If we pinged in the last 2 minutes, return a cached result
        return 100;
      }
      
      // Update last ping timestamp
      sessionStorage.setItem('last-ping-time', now.toString());
    }
    
    // Skip external requests in development
    if ((endpoint.startsWith('http') && process.env.NODE_ENV === 'development') || isIOS) {
      return 150;
    }

    // Reduce timeout for better UX
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // Shorter timeout
    
    try {
      const startTime = performance.now();
      
      const options: RequestInit = {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      };
      
      // Only use no-cors for external URLs
      if (endpoint.startsWith('http')) {
        options.mode = 'no-cors';
      }
      
      await fetch(endpoint, options);
      
      clearTimeout(timeoutId);
      return performance.now() - startTime;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Only track errors in development
      if (process.env.NODE_ENV === 'development' && 
          !(error instanceof DOMException && error.name === 'AbortError')) {
        trackError(
          error instanceof Error ? error : new Error('Unknown ping error'),
          'pingEndpoint',
          { severity: 'low', silent: true }
        );
      }
      
      return null;
    }
  }, [trackError]);
  
  return { pingEndpoint };
}
