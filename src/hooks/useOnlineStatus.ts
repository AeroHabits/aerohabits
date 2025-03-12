import { useState, useEffect, useCallback } from 'react';
import { useErrorTracking } from './useErrorTracking';
import { trackNetworkChange } from '@/lib/analytics';

// Connection quality thresholds in ms
const LATENCY_THRESHOLDS = {
  GOOD: 200,      // Under 200ms is good
  ACCEPTABLE: 500 // Under 500ms is acceptable, over is poor
};

// Sample endpoints to ping for connection testing
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
  
  // Comprehensive network quality check
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
      
      for (const endpoint of PING_ENDPOINTS) {
        const latency = await pingEndpoint(endpoint);
        
        if (latency !== null) {
          latencies.push(latency);
          pingResults.push({ success: true, timestamp: Date.now() });
        } else {
          pingResults.push({ success: false, timestamp: Date.now() });
        }
      }
      
      // Update ping history
      setPingHistory(prev => {
        const newHistory = [...prev, ...pingResults];
        // Limit history size to last 100 pings
        return newHistory.slice(-100);
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
          const newDetails: ConnectionStatus = {
            ...prev,
            latency: medianLatency,
            quality,
            downlinkSpeed,
            lastChecked: Date.now(),
            reliability
          };
          
          // Only track network changes if quality changed
          if (prev.quality !== quality) {
            // Convert our quality to the format expected by trackNetworkChange
            // Fix: Use correct type for the quality comparison
            let networkStatus: 'online' | 'offline' | 'poor' | 'good';
            
            if (quality === 'offline') {
              networkStatus = 'offline';
            } else if (quality === 'poor') {
              networkStatus = 'poor';
            } else {
              networkStatus = 'online';
            }
            
            trackNetworkChange(networkStatus, { 
              latency: medianLatency,
              downlinkSpeed,
              reliability
            });
          }
          
          return newDetails;
        });
      } else if (isOnline) {
        // All pings failed but we're still "online" according to the browser
        setConnectionDetails(prev => {
          const newDetails: ConnectionStatus = {
            ...prev,
            quality: 'poor',
            lastChecked: Date.now(),
            reliability: calculateReliability([...pingHistory, ...pingResults])
          };
          
          // Track network change if quality changed
          if (prev.quality !== 'poor') {
            trackNetworkChange('poor');
          }
          
          return newDetails;
        });
      }
    } catch (error) {
      trackError(
        error instanceof Error ? error : new Error('Network check error'),
        'checkConnectionQuality',
        { severity: 'low', silent: true }
      );
    }
  }, [isOnline, pingEndpoint, pingHistory, calculateReliability, trackError]);

  // Set up the connection quality check interval
  useEffect(() => {
    // Initial check
    checkConnectionQuality();
    
    // Adaptive check frequency - more frequent when on poor connections
    let checkInterval = connectionDetails.quality === 'poor' ? 15000 : 30000;
    
    const intervalId = setInterval(() => {
      if (isOnline) {
        checkConnectionQuality();
        
        // Adjust check frequency based on connection quality
        if (connectionDetails.quality === 'poor' && checkInterval !== 15000) {
          clearInterval(intervalId);
          checkInterval = 15000;
          setInterval(checkConnectionQuality, checkInterval);
        } else if (connectionDetails.quality !== 'poor' && checkInterval !== 30000) {
          clearInterval(intervalId);
          checkInterval = 30000;
          setInterval(checkConnectionQuality, checkInterval);
        }
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
