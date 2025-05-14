
import { useState, useCallback, useEffect } from 'react';
import { usePingService } from './usePingService';
import { useReliabilityTracker } from './useReliabilityTracker';
import { useNetworkEvents } from './useNetworkEvents';
import { useErrorTracking } from '../useErrorTracking';
import { trackNetworkChange } from '@/lib/analytics/networkTracking';
import { ConnectionStatus, LATENCY_THRESHOLDS, PING_ENDPOINTS } from './types';

export function useConnectionQuality() {
  // Guard against non-browser environments
  const isClient = typeof window !== 'undefined';
  
  // Only call useNetworkEvents in browser environment
  const networkEvents = isClient ? useNetworkEvents() : { isOnline: true };
  const { isOnline } = networkEvents;
  
  const { pingEndpoint } = usePingService();
  const { pingHistory, calculateReliability, updatePingHistory } = useReliabilityTracker();
  const { trackError } = useErrorTracking();
  
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline: isClient ? window.navigator.onLine : true,
    latency: null,
    quality: isClient && window.navigator.onLine ? 'good' : 'offline',
    downlinkSpeed: null,
    lastChecked: Date.now(),
    reliability: 100,
  });
  
  const checkConnectionQuality = useCallback(async () => {
    if (!isOnline || !isClient) return;
    
    try {
      const latency = await pingEndpoint(PING_ENDPOINTS[0]);
      
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Network check error:', error);
      }
    }
  }, [isOnline, pingEndpoint, connectionDetails, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const initialCheckDelay = setTimeout(() => {
      checkConnectionQuality();
    }, 15000);
    
    return () => {
      clearTimeout(initialCheckDelay);
    };
  }, [checkConnectionQuality, isClient]);

  useEffect(() => {
    if (isClient) {
      checkConnectionQuality();
    }
  }, [isOnline, checkConnectionQuality, isClient]);

  return { 
    connectionDetails,
    isOnline
  };
}
