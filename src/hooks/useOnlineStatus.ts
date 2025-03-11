import { useState, useEffect, useCallback, useRef } from 'react';
import { useErrorTracking } from './useErrorTracking';
import { trackNetworkChange } from '@/lib/analytics';

// Connection quality thresholds in ms
const LATENCY_THRESHOLDS = {
  GOOD: 200,      // Under 200ms is good
  ACCEPTABLE: 500 // Under 500ms is acceptable, over is poor
};

// Sample endpoints to ping for connection testing - using reliable CDNs
// Reduced number of endpoints to minimize network requests
const PING_ENDPOINTS = [
  'https://www.cloudflare.com',
];

// Detect if we're running on iOS - used to optimize battery usage
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

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
  const checkIntervalRef = useRef<number | null>(null);
  const lastPingTime = useRef<number>(0);
  
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
  
  // Enhanced ping function with error handling and timeout - optimized to reduce network load
  const pingEndpoint = useCallback(async (endpoint: string): Promise<number | null> => {
    const now = Date.now();
    
    // Throttle pings to once every 30 seconds maximum
    if (now - lastPingTime.current < 30000) {
      return null;
    }
    
    lastPingTime.current = now;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
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
      
      // Don't log these as errors, just as info
      console.log(`Failed to ping ${endpoint}`);
      
      // Use a lower severity for these common errors
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
      
      // Only ping if we're online and we haven't pinged recently
      const now = Date.now();
      if (now - lastPingTime.current < 30000) {
        return;
      }
      
      // Try pinging our single endpoint
      const endpoint = PING_ENDPOINTS[0];
      const latency = await pingEndpoint(endpoint);
      
      const pingResult = { 
        success: latency !== null, 
        timestamp: now
      };
      
      // Update ping history - keep history very small
      setPingHistory(prev => {
        const newHistory = [...prev, pingResult];
        // Limit history size to last 10 pings (reduced from 20)
        return newHistory.slice(-10);
      });
      
      // If we have latency measurements, determine quality
      if (latency !== null) {
        // Determine quality based on latency
        let quality: 'good' | 'acceptable' | 'poor' | 'offline' = 'good';
        if (latency > LATENCY_THRESHOLDS.ACCEPTABLE) {
          quality = 'poor';
        } else if (latency > LATENCY_THRESHOLDS.GOOD) {
          quality = 'acceptable';
        }
        
        // Calculate reliability
        const reliability = calculateReliability([...pingHistory, pingResult]);
        
        // Update connection details
        setConnectionDetails(prev => {
          const newDetails = {
            ...prev,
            latency,
            quality,
            downlinkSpeed,
            lastChecked: now,
            reliability
          };
          
          // Only track network changes if quality changed significantly
          if (prev.quality !== quality) {
            if (quality === 'poor' && prev.quality !== 'poor') {
              trackNetworkChange('poor', { 
                latency,
                downlinkSpeed,
                reliability
              });
            } else if (quality === 'good' && prev.quality !== 'good') {
              trackNetworkChange('good', { 
                latency,
                downlinkSpeed,
                reliability
              });
            }
          }
          
          return newDetails;
        });
      } 
    } catch (error) {
      // Only log significant errors
      if (process.env.NODE_ENV === 'development') {
        console.log("Network check error:", error);
      }
      
      trackError(
        error instanceof Error ? error : new Error('Network check error'),
        'checkConnectionQuality',
        { severity: 'low', silent: true }
      );
    }
  }, [isOnline, pingEndpoint, pingHistory, calculateReliability, trackError]);

  // Set up the connection quality check interval with reduced frequency
  useEffect(() => {
    // Initial check - but add a delay to not block page load
    const initialCheckTimeout = setTimeout(() => {
      checkConnectionQuality();
    }, 5000);
    
    // Much less frequent checks - dramatically increased intervals
    let checkInterval = isIOS 
      ? 300000  // 5 minutes on iOS to preserve battery
      : 180000; // 3 minutes on other platforms
    
    // Further increase interval when connection is good
    if (connectionDetails.quality === 'good') {
      checkInterval *= 1.5;
    }
    
    checkIntervalRef.current = window.setInterval(() => {
      if (isOnline && document.visibilityState === 'visible') {
        checkConnectionQuality();
      }
    }, checkInterval);

    return () => {
      clearTimeout(initialCheckTimeout);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
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
  }, []);

  return connectionDetails;
}
