
import { useCallback } from 'react';
import { useErrorTracking } from '../useErrorTracking';

export function usePingService() {
  const { trackError } = useErrorTracking();
  
  // Enhanced ping function with error handling and timeout
  const pingEndpoint = useCallback(async (endpoint: string): Promise<number | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    
    try {
      const startTime = performance.now();
      
      await fetch(`${endpoint}/favicon.ico`, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return performance.now() - startTime;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Only track errors that aren't aborts
      if (error instanceof DOMException && error.name === 'AbortError') {
        return null;
      }
      
      trackError(
        error instanceof Error ? error : new Error('Unknown ping error'),
        'pingEndpoint',
        { severity: 'low', silent: true }
      );
      
      return null;
    }
  }, [trackError]);
  
  return { pingEndpoint };
}
