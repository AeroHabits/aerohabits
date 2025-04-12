
import { useState, useEffect } from 'react';
import { usePerformanceMonitoring } from '../usePerformanceMonitoring';

interface ConnectionStats {
  activeConnections: number;
  maxConnections: number;
  waitingRequests: number;
}

export function useConnectionPool(poolSize = 10) {
  const [stats, setStats] = useState<ConnectionStats>({
    activeConnections: 0,
    maxConnections: poolSize,
    waitingRequests: 0
  });
  
  const { measureAsync } = usePerformanceMonitoring();

  const acquireConnection = async () => {
    return measureAsync('database.connection.acquire', async () => {
      if (stats.activeConnections >= poolSize) {
        setStats(prev => ({
          ...prev,
          waitingRequests: prev.waitingRequests + 1
        }));
        
        // Wait for a connection to become available
        await new Promise(resolve => {
          const checkAvailability = () => {
            if (stats.activeConnections < poolSize) {
              resolve(true);
            } else {
              setTimeout(checkAvailability, 100);
            }
          };
          checkAvailability();
        });
      }

      setStats(prev => ({
        ...prev,
        activeConnections: prev.activeConnections + 1,
        waitingRequests: Math.max(0, prev.waitingRequests - 1)
      }));
    });
  };

  const releaseConnection = () => {
    setStats(prev => ({
      ...prev,
      activeConnections: Math.max(0, prev.activeConnections - 1)
    }));
  };

  return {
    stats,
    acquireConnection,
    releaseConnection
  };
}
