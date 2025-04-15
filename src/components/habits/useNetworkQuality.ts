
import { useState, useEffect, useCallback } from 'react';

// Constants for better stale time management
export const STALE_TIME = {
  DEFAULT: 30000,         // 30 seconds
  EXTENDED: 5 * 60 * 1000, // 5 minutes when network is slow/unstable
  IOS: 10 * 60 * 1000     // 10 minutes on iOS devices
};

// Network quality detection types
export type NetworkQuality = 'good' | 'poor' | 'offline';

export function useNetworkQuality(isOnline: boolean) {
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(getNetworkQuality());
  
  // Detect iOS platform
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  
  // Update network quality when online status changes
  useEffect(() => {
    // For iOS, just use a simple check
    if (isIOS) {
      setNetworkQuality(isOnline ? 'good' : 'offline');
      return;
    }
    
    // More detailed check for other platforms
    setNetworkQuality(getNetworkQuality());
    
    // Check less frequently for better performance
    const isMobile = navigator.userAgent.match(/iPhone|iPad|iPod|Android/i);
    const checkInterval = isMobile ? 120000 : 60000; // 2 minutes on mobile, 1 minute otherwise
    
    // Setup periodic network quality check with reduced frequency
    const intervalId = setInterval(() => {
      // Check connection quality
      setNetworkQuality(getNetworkQuality());
    }, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [isOnline, isIOS]);

  return {
    networkQuality,
    getStaleTime: useCallback(() => {
      // For iOS, use much longer stale times to reduce API calls
      if (isIOS) return STALE_TIME.IOS;
      
      if (networkQuality === 'poor') {
        return STALE_TIME.EXTENDED;
      }
      return STALE_TIME.DEFAULT;
    }, [networkQuality, isIOS])
  };
}

// Helper function to detect network quality with multiple fallback mechanisms
export const getNetworkQuality = (): NetworkQuality => {
  // Primary check: offline status
  if (!navigator.onLine) return 'offline';
  
  // iOS detection - always return 'good' for iOS to simplify logic
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  
  if (isIOS) return 'good';
  
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
  
  // Default assessment for better mobile performance
  return 'good';
};
