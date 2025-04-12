
import { useCallback } from 'react';
import { useErrorTracking } from '../useErrorTracking';

export function usePingService() {
  const { trackError } = useErrorTracking();
  
  // Enhanced ping function with better error handling and improved reliability
  const pingEndpoint = useCallback(async (endpoint: string): Promise<number | null> => {
    // Skip external requests if the endpoint is not a relative URL and we're in development
    if (endpoint.startsWith('http') && process.env.NODE_ENV === 'development') {
      // In development, just return a simulated good ping time to avoid CORS issues
      return 150;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduced timeout for better UX
    
    try {
      const startTime = performance.now();
      
      // For relative URLs, don't use no-cors mode
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
      
      // Only track errors that aren't aborts
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
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
