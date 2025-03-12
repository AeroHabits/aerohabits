
import { useState, useCallback } from 'react';
import { PingResult } from './types';

export function useReliabilityTracker() {
  const [pingHistory, setPingHistory] = useState<PingResult[]>([]);
  
  // Calculate connection reliability
  const calculateReliability = useCallback((history: PingResult[]) => {
    // Only consider pings from the last hour
    const now = Date.now();
    const recentPings = history.filter(ping => now - ping.timestamp < 60 * 60 * 1000);
    
    if (recentPings.length === 0) return 100;
    
    // Calculate success rate
    const successCount = recentPings.filter(ping => ping.success).length;
    return Math.round((successCount / recentPings.length) * 100);
  }, []);
  
  const updatePingHistory = useCallback((results: PingResult[]) => {
    setPingHistory(prev => {
      const newHistory = [...prev, ...results];
      // Limit history size to last 100 pings
      return newHistory.slice(-100);
    });
  }, []);
  
  return { 
    pingHistory, 
    calculateReliability,
    updatePingHistory
  };
}
