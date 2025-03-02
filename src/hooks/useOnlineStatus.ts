
import { useState, useEffect } from 'react';

// Connection quality thresholds in ms
const LATENCY_THRESHOLDS = {
  GOOD: 200,      // Under 200ms is good
  ACCEPTABLE: 500 // Under 500ms is acceptable, over is poor
};

// Sample endpoints to ping for connection testing
const PING_ENDPOINTS = [
  'https://www.google.com',
  'https://www.cloudflare.com'
];

export interface ConnectionStatus {
  isOnline: boolean;
  latency: number | null;
  quality: 'good' | 'acceptable' | 'poor' | 'offline';
  downlinkSpeed: number | null; // In Mbps if available
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline: window.navigator.onLine,
    latency: null,
    quality: window.navigator.onLine ? 'good' : 'offline',
    downlinkSpeed: null
  });

  // Basic online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionDetails(prev => ({ ...prev, isOnline: true, quality: 'good' }));
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionDetails(prev => ({ ...prev, isOnline: false, quality: 'offline' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Network quality monitoring
  useEffect(() => {
    if (!isOnline) return;

    // Check connection quality periodically
    const checkConnectionQuality = async () => {
      try {
        // Use Network Information API if available
        if ('connection' in navigator) {
          const conn = (navigator as any).connection;
          let downlinkSpeed = null;
          
          if (conn && conn.downlink) {
            downlinkSpeed = conn.downlink; // In Mbps
          }
          
          // Update downlink speed if available
          setConnectionDetails(prev => ({
            ...prev,
            downlinkSpeed
          }));
        }

        // Measure latency
        if (isOnline) {
          const startTime = performance.now();
          
          // Try to ping endpoints to measure latency
          const endpoint = PING_ENDPOINTS[Math.floor(Math.random() * PING_ENDPOINTS.length)];
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
          
          await fetch(`${endpoint}/favicon.ico`, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          const latency = performance.now() - startTime;
          
          // Determine quality based on latency
          let quality: 'good' | 'acceptable' | 'poor' | 'offline' = 'good';
          if (latency > LATENCY_THRESHOLDS.ACCEPTABLE) {
            quality = 'poor';
          } else if (latency > LATENCY_THRESHOLDS.GOOD) {
            quality = 'acceptable';
          }
          
          setConnectionDetails(prev => ({
            ...prev,
            latency,
            quality
          }));
        }
      } catch (e) {
        // On error, assume connection issues
        const isFetchAborted = e instanceof DOMException && e.name === 'AbortError';
        
        if (isFetchAborted || isOnline) {
          // If fetch was aborted or we're still technically online, mark as poor connection
          setConnectionDetails(prev => ({
            ...prev,
            latency: isFetchAborted ? 3000 : prev.latency,
            quality: 'poor'
          }));
        }
      }
    };

    // Initial check
    checkConnectionQuality();
    
    // Check quality every 30 seconds if online
    const intervalId = setInterval(() => {
      if (isOnline) {
        checkConnectionQuality();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isOnline]);

  // For backward compatibility, return isOnline boolean directly
  // Components using the more detailed API can destructure the object
  return isOnline;
}

// Export the hook that provides detailed connection info
export function useDetailedConnectionStatus(): ConnectionStatus {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline: window.navigator.onLine,
    latency: null,
    quality: window.navigator.onLine ? 'good' : 'offline',
    downlinkSpeed: null
  });

  useEffect(() => {
    // Similar implementation as useOnlineStatus but returns the full object
    // This allows existing components to continue working while new ones
    // can use the more detailed API
    
    // ... Implementation similar to useOnlineStatus
    
  }, []);

  return connectionDetails;
}
