
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
  
  // Comprehensive network quality check
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
      
      // Try pinging multiple endpoints and take the fastest response
      const latencies: number[] = [];
      const pingResults = [];
      
      for (const endpoint of PING_ENDPOINTS) {
        const latency = await pingEndpoint(endpoint);
        
        if (latency !== null) {
          latencies.push(latency);
          pingResults.push({ success: true, timestamp: Date.now() });
        } else {
          pingResults.push({ success: false, timestamp: Date.now() });
        }
      }
      
      // Update ping history
      updatePingHistory(pingResults);
      const reliability = calculateReliability([...pingHistory, ...pingResults]);
      
      // If we have latency measurements, determine quality
      if (latencies.length > 0) {
        // Use the median latency for more stability
        latencies.sort((a, b) => a - b);
        const medianLatency = latencies[Math.floor(latencies.length / 2)];
        
        // Determine quality based on latency
        let quality: ConnectionStatus['quality'] = 'good';
        if (medianLatency > LATENCY_THRESHOLDS.ACCEPTABLE) {
          quality = 'poor';
        } else if (medianLatency > LATENCY_THRESHOLDS.GOOD) {
          quality = 'acceptable';
        }
        
        // Update connection details
        setConnectionDetails(prev => {
          const newDetails: ConnectionStatus = {
            ...prev,
            latency: medianLatency,
            quality,
            downlinkSpeed,
            lastChecked: Date.now(),
            reliability
          };
          
          // Only track network changes if quality changed
          if (prev.quality !== quality) {
            // Map quality to appropriate network status
            let networkStatus: 'online' | 'offline' | 'poor' | 'good';
            
            if (quality === 'poor') {
              networkStatus = 'poor';
            } else if (quality === 'good') {
              networkStatus = 'good';
            } else {
              // For 'acceptable', we'll use 'online'
              networkStatus = 'online';
            }
            
            trackNetworkChange(networkStatus, { 
              latency: medianLatency,
              downlinkSpeed,
              reliability
            });
          }
          
          return newDetails;
        });
      } else if (isOnline) {
        // All pings failed but we're still "online" according to the browser
        setConnectionDetails(prev => {
          const newDetails: ConnectionStatus = {
            ...prev,
            quality: 'poor',
            lastChecked: Date.now(),
            reliability: calculateReliability([...pingHistory, ...pingResults])
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

  // Set up the connection quality check interval
  useEffect(() => {
    // Initial check
    checkConnectionQuality();
    
    // Adaptive check frequency - more frequent when on poor connections
    let checkInterval = connectionDetails.quality === 'poor' ? 15000 : 30000;
    
    const intervalId = setInterval(() => {
      if (isOnline) {
        checkConnectionQuality();
        
        // Adjust check frequency based on connection quality
        if (connectionDetails.quality === 'poor' && checkInterval !== 15000) {
          clearInterval(intervalId);
          checkInterval = 15000;
          setInterval(checkConnectionQuality, checkInterval);
        } else if (connectionDetails.quality !== 'poor' && checkInterval !== 30000) {
          clearInterval(intervalId);
          checkInterval = 30000;
          setInterval(checkConnectionQuality, checkInterval);
        }
      }
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [isOnline, checkConnectionQuality, connectionDetails.quality]);

  return { 
    connectionDetails,
    isOnline
  };
}
