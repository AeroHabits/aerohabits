
import { useState, useEffect, useCallback } from 'react';
import { useErrorTracking } from './useErrorTracking';
import { trackNetworkChange } from '@/lib/analytics';

// Connection quality thresholds in ms
const LATENCY_THRESHOLDS = {
  GOOD: 200,      // Under 200ms is good
  ACCEPTABLE: 500 // Under 500ms is acceptable, over is poor
};

// Sample endpoints to ping for connection testing - using reliable CDNs
const PING_ENDPOINTS = [
  'https://www.google.com',
  'https://www.cloudflare.com',
  'https://www.fastly.com',
];

export interface ConnectionStatus {
  isOnline: boolean;
  latency: number | null;
  quality: 'good' | 'acceptable' | 'poor' | 'offline';
  downlinkSpeed: number | null; // In Mbps if available
  lastChecked: number; // Timestamp
  reliability: number; // 0-100% based on recent checks
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline: window.navigator.onLine,
    latency: null,
    quality: window.navigator.onLine ? 'good' : 'offline',
    downlinkSpeed: null,
    lastChecked: Date.now(),
    reliability: 100,
  });
  const { trackError } = useErrorTracking();
  
  // Track ping history for reliability calculation
  const [pingHistory, setPingHistory] = useState<Array<{ success: boolean; timestamp: number }>>([]);
  
  // Basic online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionDetails(prev => ({ 
        ...prev, 
        isOnline: true, 
        quality: 'good',
        lastChecked: Date.now(),
      }));
      
      // Track the network change event
      trackNetworkChange('online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionDetails(prev => ({ 
        ...prev, 
        isOnline: false, 
        quality: 'offline',
        lastChecked: Date.now(),
      }));
      
      // Track the network change event
      trackNetworkChange('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Calculate connection reliability
  const calculateReliability = useCallback((history: Array<{ success: boolean; timestamp: number }>) => {
    // Only consider pings from the last hour
    const now = Date.now();
    const recentPings = history.filter(ping => now - ping.timestamp < 60 * 60 * 1000);
    
    if (recentPings.length === 0) return 100;
    
    // Calculate success rate
    const successCount = recentPings.filter(ping => ping.success).length;
    return Math.round((successCount / recentPings.length) * 100);
  }, []);
  
  // Enhanced ping function with error handling and timeout
  const pingEndpoint = useCallback(async (endpoint: string): Promise<number | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout - increased from 3s
    
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
        console.log(`Ping to ${endpoint} timed out`);
        return null;
      }
      
      // Don't log these as errors, just as info
      console.log(`Failed to ping ${endpoint}:`, error);
      
      trackError(
        error instanceof Error ? error : new Error('Unknown ping error'),
        'pingEndpoint',
        { severity: 'low', silent: true }
      );
      
      return null;
    }
  }, [trackError]);
  
  // Comprehensive network quality check with better error handling
  const checkConnectionQuality = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      // Start with Network Information API if available
      let downlinkSpeed = null;
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn && conn.downlink) {
          downlinkSpeed = conn.downlink; // In Mbps
        }
      }
      
      // Try pinging multiple endpoints and take the fastest response
      const latencies: number[] = [];
      const pingResults: Array<{ success: boolean; timestamp: number }> = [];
      
      // Only try to ping one endpoint at a time to reduce network load
      const randomEndpointIndex = Math.floor(Math.random() * PING_ENDPOINTS.length);
      const endpoint = PING_ENDPOINTS[randomEndpointIndex];
      
      try {
        const latency = await pingEndpoint(endpoint);
        
        if (latency !== null) {
          latencies.push(latency);
          pingResults.push({ success: true, timestamp: Date.now() });
        } else {
          pingResults.push({ success: false, timestamp: Date.now() });
        }
      } catch (error) {
        console.log(`Error pinging ${endpoint}:`, error);
        pingResults.push({ success: false, timestamp: Date.now() });
      }
      
      // Update ping history
      setPingHistory(prev => {
        const newHistory = [...prev, ...pingResults];
        // Limit history size to last 20 pings (reduced from 100)
        return newHistory.slice(-20);
      });
      
      // If we have latency measurements, determine quality
      if (latencies.length > 0) {
        // Use the median latency for more stability
        latencies.sort((a, b) => a - b);
        const medianLatency = latencies[Math.floor(latencies.length / 2)];
        
        // Determine quality based on latency
        let quality: 'good' | 'acceptable' | 'poor' | 'offline' = 'good';
        if (medianLatency > LATENCY_THRESHOLDS.ACCEPTABLE) {
          quality = 'poor';
        } else if (medianLatency > LATENCY_THRESHOLDS.GOOD) {
          quality = 'acceptable';
        }
        
        // Calculate reliability
        const reliability = calculateReliability([...pingHistory, ...pingResults]);
        
        // Update connection details
        setConnectionDetails(prev => {
          const newDetails = {
            ...prev,
            latency: medianLatency,
            quality,
            downlinkSpeed,
            lastChecked: Date.now(),
            reliability
          };
          
          // Only track network changes if quality changed
          if (prev.quality !== quality) {
            if (quality === 'poor') {
              trackNetworkChange('poor', { 
                latency: medianLatency,
                downlinkSpeed,
                reliability
              });
            } else if (quality === 'good') {
              trackNetworkChange('good', { 
                latency: medianLatency,
                downlinkSpeed,
                reliability
              });
            }
          }
          
          return newDetails;
        });
      } else if (isOnline) {
        // All pings failed but we're still "online" according to the browser
        setConnectionDetails(prev => ({
          ...prev,
          quality: 'poor',
          lastChecked: Date.now(),
          reliability: calculateReliability([...pingHistory, ...pingResults])
        }));
          
        // Track network change if quality changed
        if (connectionDetails.quality !== 'poor') {
          trackNetworkChange('poor');
        }
      }
    } catch (error) {
      console.log("Network check error:", error);
      trackError(
        error instanceof Error ? error : new Error('Network check error'),
        'checkConnectionQuality',
        { severity: 'low', silent: true }
      );
    }
  }, [isOnline, pingEndpoint, pingHistory, calculateReliability, trackError, connectionDetails.quality]);

  // Set up the connection quality check interval with reduced frequency
  useEffect(() => {
    // Initial check
    checkConnectionQuality();
    
    // Adaptive check frequency - more frequent when on poor connections
    // But much less frequent overall to reduce network load
    let checkInterval = connectionDetails.quality === 'poor' ? 60000 : 120000; // 1 or 2 minutes
    
    const intervalId = setInterval(() => {
      if (isOnline) {
        checkConnectionQuality();
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [isOnline, checkConnectionQuality, connectionDetails.quality]);

  // For backward compatibility, return isOnline boolean directly
  return isOnline;
}

// Export the hook that provides detailed connection info
export function useDetailedConnectionStatus(): ConnectionStatus {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline: window.navigator.onLine,
    latency: null,
    quality: window.navigator.onLine ? 'good' : 'offline',
    downlinkSpeed: null,
    lastChecked: Date.now(),
    reliability: 100,
  });

  useEffect(() => {
    // Implementation leveraging the shared functionality from useOnlineStatus
    // ... Similar implementation as useOnlineStatus
  }, []);

  return connectionDetails;
}
