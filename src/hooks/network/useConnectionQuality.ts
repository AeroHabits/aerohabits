
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
  
  // Less aggressive network quality check
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
      
      // Only ping the local endpoint first for better reliability
      const latency = await pingEndpoint(PING_ENDPOINTS[0]);
      const pingResult = { success: latency !== null, timestamp: Date.now() };
      
      // Update ping history
      updatePingHistory([pingResult]);
      const reliability = calculateReliability([...pingHistory, pingResult]);
      
      // If we have latency measurement, determine quality
      if (latency !== null) {
        // Determine quality based on latency
        let quality: ConnectionStatus['quality'] = 'good';
        if (latency > LATENCY_THRESHOLDS.ACCEPTABLE) {
          quality = 'poor';
        } else if (latency > LATENCY_THRESHOLDS.GOOD) {
          quality = 'acceptable';
        }
        
        // Only update if quality has changed or it's been a while since last update
        const shouldUpdate = 
          connectionDetails.quality !== quality ||
          Date.now() - connectionDetails.lastChecked > 60000; // 1 minute
          
        if (shouldUpdate) {
          setConnectionDetails(prev => {
            const newDetails: ConnectionStatus = {
              ...prev,
              latency,
              quality,
              downlinkSpeed,
              lastChecked: Date.now(),
              reliability
            };
            
            // Only track significant network changes
            if (prev.quality !== quality && (quality === 'poor' || prev.quality === 'poor')) {
              let networkStatus: 'online' | 'offline' | 'poor' | 'good';
              
              if (quality === 'poor') {
                networkStatus = 'poor';
              } else if (quality === 'good') {
                networkStatus = 'good';
              } else {
                networkStatus = 'online';
              }
              
              trackNetworkChange(networkStatus, { 
                latency,
                downlinkSpeed,
                reliability
              });
            }
            
            return newDetails;
          });
        }
      } else if (isOnline && connectionDetails.quality !== 'poor') {
        // Ping failed but we're still "online" - don't immediately assume poor connection
        // Try one more endpoint before determining quality
        const backupLatency = await pingEndpoint(PING_ENDPOINTS[1]);
        
        if (backupLatency === null) {
          setConnectionDetails(prev => {
            const newDetails: ConnectionStatus = {
              ...prev,
              quality: 'poor',
              lastChecked: Date.now(),
              reliability: calculateReliability([...pingHistory, pingResult])
            };
            
            // Track network change if quality changed
            if (prev.quality !== 'poor') {
              trackNetworkChange('poor');
            }
            
            return newDetails;
          });
        }
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

  // Much less frequent connection quality checks
  useEffect(() => {
    // Initial check with a delay to avoid false positives during app startup
    const initialCheckDelay = setTimeout(() => {
      checkConnectionQuality();
    }, 5000);
    
    // Greatly reduced check frequency to reduce network noise
    const checkInterval = 120000; // Check only once every 2 minutes
    
    const intervalId = setInterval(() => {
      if (isOnline) {
        checkConnectionQuality();
      }
    }, checkInterval);

    return () => {
      clearTimeout(initialCheckDelay);
      clearInterval(intervalId);
    };
  }, [isOnline, checkConnectionQuality]);

  return { 
    connectionDetails,
    isOnline
  };
}
