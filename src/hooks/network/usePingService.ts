
import { useCallback } from 'react';
import { useErrorTracking } from '../useErrorTracking';

export function usePingService() {
  const { trackError } = useErrorTracking();
  
  const pingEndpoint = useCallback(async (endpoint: string): Promise<number | null> => {
    // Skip external requests in development
    if (endpoint.startsWith('http') && process.env.NODE_ENV === 'development') {
      return 150;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    
    try {
      const startTime = performance.now();
      
      const options: RequestInit = {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      };
      
      if (endpoint.startsWith('http')) {
        options.mode = 'no-cors';
      }
      
      await fetch(endpoint, options);
      
      clearTimeout(timeoutId);
      return performance.now() - startTime;
    } catch (error) {
      clearTimeout(timeoutId);
      
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
