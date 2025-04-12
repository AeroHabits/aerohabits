
import { useState, useEffect, useCallback } from 'react';

// Constants for better stale time management
export const STALE_TIME = {
  DEFAULT: 30000,         // 30 seconds
  EXTENDED: 5 * 60 * 1000 // 5 minutes when network is slow/unstable
};

// Network quality detection types
export type NetworkQuality = 'good' | 'poor' | 'offline';

export function useNetworkQuality(isOnline: boolean) {
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(getNetworkQuality());
  const [lastPingTime, setLastPingTime] = useState<number | null>(null);
  
  // Update network quality when online status changes
  useEffect(() => {
    setNetworkQuality(getNetworkQuality());
    
    // Setup periodic network quality check
    const intervalId = setInterval(() => {
      // Check connection quality
      setNetworkQuality(getNetworkQuality());
      
      // If navigator.connection is not available, measure ping time
      if (isOnline && !('connection' in navigator)) {
        checkPingTime().then(pingTime => {
          if (pingTime !== null) {
            setLastPingTime(pingTime);
          }
        });
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [isOnline]);

  return {
    networkQuality,
    getStaleTime: useCallback(() => {
      if (networkQuality === 'poor') {
        return STALE_TIME.EXTENDED;
      }
      return STALE_TIME.DEFAULT;
    }, [networkQuality])
  };
}

// Helper function to detect network quality with multiple fallback mechanisms
export const getNetworkQuality = (): NetworkQuality => {
  // Primary check: offline status
  if (!navigator.onLine) return 'offline';
  
  // Secondary check: Connection API if available
  if ('connection' in navigator && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
      return 'poor';
    }
    
    // Also consider downlink speed if available
    if (typeof conn.downlink === 'number') {
      if (conn.downlink < 1.0) { // Less than 1 Mbps
        return 'poor';
      }
    }
  }
  
  // Tertiary check: Use localStorage to check previous measurements
  try {
    const storedPingTime = localStorage.getItem('network_last_ping_time');
    if (storedPingTime) {
      const pingTime = parseInt(storedPingTime, 10);
      if (pingTime > 500) { // Over 500ms ping time
        return 'poor';
      }
    }
  } catch (error) {
    console.warn('Error reading network quality from localStorage:', error);
  }
  
  // Default assessment
  return 'good';
};

// Helper function to measure network performance via simple ping
const checkPingTime = async (): Promise<number | null> => {
  try {
    const start = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    await fetch('/favicon.ico', {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const pingTime = Math.round(performance.now() - start);
    
    // Store for future reference
    try {
      localStorage.setItem('network_last_ping_time', pingTime.toString());
      localStorage.setItem('network_last_check', Date.now().toString());
    } catch (error) {
      console.warn('Error saving network quality to localStorage:', error);
    }
    
    return pingTime;
  } catch (error) {
    console.warn('Error measuring network ping time:', error);
    return null;
  }
};
