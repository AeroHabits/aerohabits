
import { useState, useCallback, useEffect } from 'react';
import { usePingService } from './usePingService';
import { useReliabilityTracker } from './useReliabilityTracker';
import { useNetworkEvents } from './useNetworkEvents';
import { useErrorTracking } from '../useErrorTracking';
import { trackNetworkChange } from '@/lib/analytics/networkTracking';
import { ConnectionStatus, LATENCY_THRESHOLDS, PING_ENDPOINTS } from './types';

// iOS-specific optimizations
export function useConnectionQuality() {
  const { isOnline } = useNetworkEvents();
  const { pingEndpoint } = usePingService();
  const { pingHistory, calculateReliability, updatePingHistory } = useReliabilityTracker();
  const { trackError } = useErrorTracking();
  
  // Detect iOS platform
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline: window.navigator.onLine,
    latency: null,
    quality: window.navigator.onLine ? 'good' : 'offline',
    downlinkSpeed: null,
    lastChecked: Date.now(),
    reliability: 100,
  });
  
  // Ultra-minimal network checking for iOS
  const checkConnectionQuality = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      // Only check on connection status changes for iOS
      if (isIOS) {
        // For iOS, just update online/offline status without pings for better performance
        if (connectionDetails.isOnline !== isOnline) {
          setConnectionDetails(prev => ({
            ...prev,
            isOnline,
            quality: isOnline ? 'good' : 'offline',
            lastChecked: Date.now(),
          }));
          
          trackNetworkChange(isOnline ? 'online' : 'offline');
        }
        
        // Skip expensive ping operations on iOS
        return;
      }
      
      // For other platforms, do the minimal ping
      const latency = await pingEndpoint(PING_ENDPOINTS[0]);
      
      // Only update state if connection status actually changed
      if (latency === null && connectionDetails.isOnline) {
        setConnectionDetails(prev => ({
          ...prev,
          isOnline: false,
          quality: 'offline',
          lastChecked: Date.now(),
        }));
        
        trackNetworkChange('offline');
      } else if (latency !== null && !connectionDetails.isOnline) {
        setConnectionDetails(prev => ({
          ...prev,
          isOnline: true,
          latency,
          quality: 'good',
          lastChecked: Date.now(),
        }));
        
        trackNetworkChange('online');
      }
    } catch (error) {
      // Silent error handling to prevent excessive logs
      if (process.env.NODE_ENV === 'development') {
        console.error('Network check error:', error);
      }
    }
  }, [isOnline, pingEndpoint, connectionDetails, isIOS]);

  // Only check on ACTUAL network status changes
  useEffect(() => {
    // For iOS, use a much longer initial delay to avoid startup impact
    const initialCheckDelay = setTimeout(() => {
      checkConnectionQuality();
    }, isIOS ? 30000 : 15000); // 30 seconds for iOS, 15 seconds for others
    
    return () => {
      clearTimeout(initialCheckDelay);
    };
  }, [checkConnectionQuality, isIOS]);

  // Check when online status actually changes, not on a timer
  useEffect(() => {
    checkConnectionQuality();
  }, [isOnline, checkConnectionQuality]);

  return { 
    connectionDetails,
    isOnline
  };
}
