
import { useState, useEffect, useRef } from 'react';

/**
 * A hook that provides the current online status of the app
 * @returns {boolean} Whether the app is currently online
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Connection quality classifications
 */
type ConnectionQuality = 'good' | 'acceptable' | 'poor';

/**
 * Detailed connection status information
 */
export interface DetailedConnectionStatus {
  isOnline: boolean;
  quality: ConnectionQuality;
  latency: number | null;
  downlinkSpeed: number | null;
  reliability: number;
  lastChecked: number;
}

/**
 * A hook that provides detailed connection status information
 * @returns {DetailedConnectionStatus} Detailed connection status information
 */
export function useDetailedConnectionStatus(): DetailedConnectionStatus {
  const isOnline = useOnlineStatus();
  const [quality, setQuality] = useState<ConnectionQuality>('good');
  const [latency, setLatency] = useState<number | null>(null);
  const [downlinkSpeed, setDownlinkSpeed] = useState<number | null>(null);
  const [reliability, setReliability] = useState<number>(100);
  const [lastChecked, setLastChecked] = useState<number>(Date.now());
  
  const connectionChecksRef = useRef<{ success: number; total: number }>({ success: 0, total: 0 });
  const checkIntervalRef = useRef<number | null>(null);
  
  // Check connection quality
  useEffect(() => {
    const checkConnectionQuality = async () => {
      if (!isOnline) {
        setQuality('poor');
        setLatency(null);
        setDownlinkSpeed(null);
        setReliability(0);
        setLastChecked(Date.now());
        return;
      }

      try {
        // Check latency with a lightweight request
        const startTime = performance.now();
        try {
          await fetch('https://www.google.com/generate_204', { 
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store'
            // Removed timeout property as it's not valid in RequestInit
          });
          const endTime = performance.now();
          const pingLatency = endTime - startTime;
          setLatency(pingLatency);
          
          // Update connection checks for reliability calculation
          connectionChecksRef.current.total++;
          connectionChecksRef.current.success++;
          
          // Calculate reliability percentage
          const reliability = Math.round(
            (connectionChecksRef.current.success / connectionChecksRef.current.total) * 100
          );
          setReliability(reliability);
          
          // Determine quality based on latency
          if (pingLatency < 200) {
            setQuality('good');
          } else if (pingLatency < 500) {
            setQuality('acceptable');
          } else {
            setQuality('poor');
          }
        } catch (error) {
          // Failed to fetch, increment total but not success count
          connectionChecksRef.current.total++;
          setQuality('poor');
          
          // Recalculate reliability
          const reliability = Math.round(
            (connectionChecksRef.current.success / connectionChecksRef.current.total) * 100
          );
          setReliability(reliability);
        }
        
        // Check download speed using navigator.connection if available
        if ('connection' in navigator && (navigator as any).connection) {
          const connection = (navigator as any).connection;
          if (connection.downlink) {
            setDownlinkSpeed(connection.downlink);
            
            // Adjust quality based on downlink if needed
            if (connection.downlink < 1) {
              setQuality('poor');
            } else if (connection.downlink < 5 && quality === 'good') {
              setQuality('acceptable');
            }
          }
        }
        
        setLastChecked(Date.now());
      } catch (error) {
        console.error('Error checking connection quality:', error);
      }
    };

    // Run the check immediately
    checkConnectionQuality();
    
    // Set up an interval to check connection quality periodically
    // Use a more battery-friendly interval of 30 seconds
    const intervalId = window.setInterval(checkConnectionQuality, 30000);
    checkIntervalRef.current = intervalId;
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isOnline, quality]);
  
  return {
    isOnline,
    quality,
    latency,
    downlinkSpeed,
    reliability,
    lastChecked
  };
}
