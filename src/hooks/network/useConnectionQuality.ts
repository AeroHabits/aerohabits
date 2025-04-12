
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
  
  // Comprehensive network quality check - optimized for performance
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
      
      // Try pinging only ONE endpoint instead of multiple to reduce network load
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
        
        // Update connection details
        setConnectionDetails(prev => {
          const newDetails: ConnectionStatus = {
            ...prev,
            latency,
            quality,
            downlinkSpeed,
            lastChecked: Date.now(),
            reliability
          };
          
          // Only track network changes if quality changed
          if (prev.quality !== quality) {
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
      } else if (isOnline) {
        // Ping failed but we're still "online" according to the browser
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
    updatePingHistory
  ]);

  // Set up the connection quality check interval - MUCH less frequent
  useEffect(() => {
    // Initial check
    checkConnectionQuality();
    
    // Reduced check frequency to avoid excessive network requests
    const checkInterval = 60000; // Check only once per minute
    
    const intervalId = setInterval(() => {
      if (isOnline) {
        checkConnectionQuality();
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [isOnline, checkConnectionQuality]);

  return { 
    connectionDetails,
    isOnline
  };
}
