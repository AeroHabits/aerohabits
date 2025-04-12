
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
  
  // Less aggressive network quality check - only track connection status
  // for analytics and critical errors, not UI display
  const checkConnectionQuality = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      // We'll only do minimal connection checks for analytics
      // and background processes, no user-facing UI
      const latency = await pingEndpoint(PING_ENDPOINTS[0]);
      const pingResult = { success: latency !== null, timestamp: Date.now() };
      
      // Update ping history
      updatePingHistory([pingResult]);
      const reliability = calculateReliability([...pingHistory, pingResult]);
      
      // Only track major connection state changes
      if (latency === null && connectionDetails.quality !== 'offline' && connectionDetails.isOnline) {
        setConnectionDetails(prev => {
          const newDetails: ConnectionStatus = {
            ...prev,
            quality: 'offline',
            lastChecked: Date.now(),
            reliability
          };
          
          trackNetworkChange('offline');
          return newDetails;
        });
      } else if (latency !== null && !connectionDetails.isOnline) {
        setConnectionDetails(prev => {
          const newDetails: ConnectionStatus = {
            ...prev,
            isOnline: true,
            latency,
            quality: 'good', // Assume good by default
            lastChecked: Date.now(),
            reliability
          };
          
          trackNetworkChange('online');
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
  }, [
    isOnline, 
    pingEndpoint, 
    pingHistory, 
    calculateReliability, 
    trackError,
    updatePingHistory,
    connectionDetails
  ]);

  // Greatly reduced frequency of connection checks - only checking
  // when the browser reports connection changes, not on a timer
  useEffect(() => {
    // Check once on component mount with a longer delay
    const initialCheckDelay = setTimeout(() => {
      checkConnectionQuality();
    }, 10000);
    
    // No regular interval checks - only check when online/offline events occur
    
    return () => {
      clearTimeout(initialCheckDelay);
    };
  }, [checkConnectionQuality]);

  // Add an effect to check when online status changes
  useEffect(() => {
    checkConnectionQuality();
  }, [isOnline, checkConnectionQuality]);

  return { 
    connectionDetails,
    isOnline
  };
}
