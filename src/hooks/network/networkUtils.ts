
import { PingResult } from './networkTypes';

/**
 * Ping an endpoint to check connectivity and measure latency
 */
export const pingEndpoint = async (
  endpoint: string,
  trackErrorFn: (error: Error, source: string, options?: { severity: string; silent: boolean }) => void
): Promise<number | null> => {
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
    
    trackErrorFn(
      error instanceof Error ? error : new Error('Unknown ping error'),
      'pingEndpoint',
      { severity: 'low', silent: true }
    );
    
    return null;
  }
};

/**
 * Calculate network reliability based on ping history
 */
export const calculateReliability = (
  history: Array<PingResult>
): number => {
  // Only consider pings from the last hour
  const now = Date.now();
  const recentPings = history.filter(ping => now - ping.timestamp < 60 * 60 * 1000);
  
  if (recentPings.length === 0) return 100;
  
  // Calculate success rate
  const successCount = recentPings.filter(ping => ping.success).length;
  return Math.round((successCount / recentPings.length) * 100);
};

/**
 * Get network information from the browser if available
 */
export const getNetworkInfo = (): { downlinkSpeed: number | null } => {
  let downlinkSpeed = null;
  
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn && conn.downlink) {
      downlinkSpeed = conn.downlink; // In Mbps
    }
  }
  
  return { downlinkSpeed };
};
