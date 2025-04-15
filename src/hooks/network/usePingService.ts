
import { useCallback } from 'react';
import { useErrorTracking } from '../useErrorTracking';

export function usePingService() {
  const { trackError } = useErrorTracking();
  
  // Optimized ping function for mobile performance
  const pingEndpoint = useCallback(async (endpoint: string): Promise<number | null> => {
    // Mobile optimization: Skip frequent checks on mobile devices
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      const lastPingTime = sessionStorage.getItem('last-ping-time');
      const now = Date.now();
      
      if (lastPingTime && (now - parseInt(lastPingTime)) < 60000) {
        // If we pinged in the last minute, return a cached result
        return 150; // Assume reasonable ping time
      }
      
      // Update last ping timestamp
      sessionStorage.setItem('last-ping-time', now.toString());
    }
    
    // Skip external requests in development
    if (endpoint.startsWith('http') && process.env.NODE_ENV === 'development') {
      return 150;
    }

    // Reduce timeout for better UX
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    
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
