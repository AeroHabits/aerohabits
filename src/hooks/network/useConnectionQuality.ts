
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
  
  const checkConnectionQuality = useCallback(async () => {
    if (!isOnline) return;
    
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
  }, [isOnline, pingEndpoint, connectionDetails]);

  useEffect(() => {
    const initialCheckDelay = setTimeout(() => {
      checkConnectionQuality();
    }, 15000);
    
    return () => {
      clearTimeout(initialCheckDelay);
    };
  }, [checkConnectionQuality]);

  useEffect(() => {
    checkConnectionQuality();
  }, [isOnline, checkConnectionQuality]);

  return { 
    connectionDetails,
    isOnline
  };
}
