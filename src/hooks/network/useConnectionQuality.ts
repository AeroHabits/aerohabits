
import { useState, useCallback, useEffect } from 'react';
import { usePingService } from './usePingService';
import { useReliabilityTracker } from './useReliabilityTracker';
import { useNetworkEvents } from './useNetworkEvents';
import { useErrorTracking } from '../useErrorTracking';
import { trackNetworkChange } from '@/lib/analytics/networkTracking';
import { ConnectionStatus, LATENCY_THRESHOLDS, PING_ENDPOINTS } from './types';

export function useConnectionQuality() {
  const { isOnline } = useNetworkEvents();
  const { pingEndpoint } = usePingService();
  const { pingHistory, calculateReliability, updatePingHistory } = useReliabilityTracker();
  const { trackError } = useErrorTracking();
  
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline: window.navigator.onLine,
    latency: null,
    quality: window.navigator.onLine ? 'good' : 'offline',
    downlinkSpeed: null,
    lastChecked: Date.now(),
    reliability: 100,
  });
  
  // Minimal network checking - significantly reduced for mobile
  const checkConnectionQuality = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      // Only check when coming online/offline - no periodic checks
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
  }, [isOnline, pingEndpoint, connectionDetails]);

  // Only check on ACTUAL network status changes
  useEffect(() => {
    // Delayed initial check to avoid startup performance impact
    const initialCheckDelay = setTimeout(() => {
      checkConnectionQuality();
    }, 15000); // Increased delay for mobile performance
    
    return () => {
      clearTimeout(initialCheckDelay);
    };
  }, [checkConnectionQuality]);

  // Check when online status actually changes, not on a timer
  useEffect(() => {
    checkConnectionQuality();
  }, [isOnline, checkConnectionQuality]);

  return { 
    connectionDetails,
    isOnline
  };
}
