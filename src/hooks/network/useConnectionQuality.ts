
import { useState, useCallback, useEffect } from 'react';
import { useErrorTracking } from '../useErrorTracking';
import { pingEndpoint, calculateReliability, getNetworkInfo } from './networkUtils';
import { PING_ENDPOINTS, LATENCY_THRESHOLDS } from './networkConstants';
import { PingResult, ConnectionStatus } from './networkTypes';
import { trackNetworkChange } from '@/lib/analytics';

export function useConnectionQuality(isOnline: boolean) {
  const [pingHistory, setPingHistory] = useState<PingResult[]>([]);
  const [connectionDetails, setConnectionDetails] = useState<ConnectionStatus>({
    isOnline,
    latency: null,
    quality: isOnline ? 'good' : 'offline',
    downlinkSpeed: null,
    lastChecked: Date.now(),
    reliability: 100,
  });
  const { trackError } = useErrorTracking();
  
  // Comprehensive network quality check
  const checkConnectionQuality = useCallback(async () => {
    if (!isOnline) return;
    
    try {
      // Get network information if available
      const { downlinkSpeed } = getNetworkInfo();
      
      // Try pinging multiple endpoints and take the fastest response
      const latencies: number[] = [];
      const pingResults: PingResult[] = [];
      
      for (const endpoint of PING_ENDPOINTS) {
        const latency = await pingEndpoint(endpoint, trackError);
        
        if (latency !== null) {
          latencies.push(latency);
          pingResults.push({ success: true, timestamp: Date.now() });
        } else {
          pingResults.push({ success: false, timestamp: Date.now() });
        }
      }
      
      // Update ping history
      setPingHistory(prev => {
        const newHistory = [...prev, ...pingResults];
        // Limit history size to last 100 pings
        return newHistory.slice(-100);
      });
      
      // If we have latency measurements, determine quality
      if (latencies.length > 0) {
        // Use the median latency for more stability
        latencies.sort((a, b) => a - b);
        const medianLatency = latencies[Math.floor(latencies.length / 2)];
        
        // Determine quality based on latency
        let quality: 'good' | 'acceptable' | 'poor' | 'offline' = 'good';
        if (medianLatency > LATENCY_THRESHOLDS.ACCEPTABLE) {
          quality = 'poor';
        } else if (medianLatency > LATENCY_THRESHOLDS.GOOD) {
          quality = 'acceptable';
        }
        
        // Calculate reliability
        const reliability = calculateReliability([...pingHistory, ...pingResults]);
        
        // Update connection details
        setConnectionDetails(prev => {
          const newDetails = {
            ...prev,
            latency: medianLatency,
            quality,
            downlinkSpeed,
            lastChecked: Date.now(),
            reliability
          };
          
          // Only track network changes if quality changed
          if (prev.quality !== quality) {
            if (quality === 'poor') {
              trackNetworkChange('poor', { 
                latency: medianLatency,
                downlinkSpeed,
                reliability
              });
            } else if (quality === 'good') {
              trackNetworkChange('good', { 
                latency: medianLatency,
                downlinkSpeed,
                reliability
              });
            }
          }
          
          return newDetails;
        });
      } else if (isOnline) {
        // All pings failed but we're still "online" according to the browser
        setConnectionDetails(prev => ({
          ...prev,
          quality: 'poor',
          lastChecked: Date.now(),
          reliability: calculateReliability([...pingHistory, ...pingResults])
        }));
          
        // Track network change if quality changed
        if (connectionDetails.quality !== 'poor') {
          trackNetworkChange('poor');
        }
      }
    } catch (error) {
      trackError(
        error instanceof Error ? error : new Error('Network check error'),
        'checkConnectionQuality',
        { severity: 'low', silent: true }
      );
    }
  }, [isOnline, pingHistory, trackError, connectionDetails.quality]);

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

  return connectionDetails;
}
