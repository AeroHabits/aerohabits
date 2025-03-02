import { useEffect, useRef } from 'react';
import * as Sentry from "@sentry/react";

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  tags?: Record<string, string | number | boolean>;
}

export function usePerformanceMonitoring() {
  const metricsRef = useRef<Map<string, PerformanceMetric>>(new Map());
  const reportThresholds = useRef<Map<string, number>>(new Map([
    ['dataFetch', 2000],          // 2 seconds for data fetches
    ['rendering', 500],           // 500ms for rendering operations
    ['interaction', 100],         // 100ms for user interactions
    ['processing', 1000],         // 1 second for data processing
    ['synchronization', 5000],    // 5 seconds for sync operations
  ]));

  // Report metrics periodically to avoid overwhelming analytics
  useEffect(() => {
    const reportInterval = setInterval(() => {
      if (metricsRef.current.size === 0) return;
      
      // Create a batch of metrics to report
      const metricsToReport: PerformanceMetric[] = [];
      const metricsToKeep = new Map<string, PerformanceMetric>();
      
      metricsRef.current.forEach((metric, key) => {
        // Only report completed metrics
        if (metric.duration !== undefined) {
          metricsToReport.push(metric);
        } else {
          // Keep in-progress metrics
          metricsToKeep.set(key, metric);
        }
      });
      
      if (metricsToReport.length > 0) {
        // Report to Sentry Performance Monitoring
        metricsToReport.forEach(metric => {
          if (metric.duration) {
            Sentry.metrics.distribution(
              `app.performance.${metric.name}`, 
              metric.duration,
              metric.tags
            );
            
            // Log slower operations for debugging
            const threshold = reportThresholds.current.get(metric.name.split('.')[0]) || 1000;
            if (metric.duration > threshold) {
              console.warn(`Slow operation detected: ${metric.name} took ${metric.duration}ms`, metric.tags);
            }
          }
        });
        
        // Reset to only keep in-progress metrics
        metricsRef.current = metricsToKeep;
      }
    }, 10000); // Report every 10 seconds
    
    return () => clearInterval(reportInterval);
  }, []);
  
  const startMeasure = (name: string, tags?: Record<string, string | number | boolean>) => {
    const startTime = performance.now();
    const key = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    metricsRef.current.set(key, {
      name,
      startTime,
      tags
    });
    
    return key;
  };
  
  const endMeasure = (key: string) => {
    const metric = metricsRef.current.get(key);
    if (!metric) return undefined;
    
    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metricsRef.current.set(key, {
      ...metric,
      duration
    });
    
    return duration;
  };
  
  const measureAsync = async <T>(
    name: string, 
    operation: () => Promise<T>,
    tags?: Record<string, string | number | boolean>
  ): Promise<T> => {
    const key = startMeasure(name, tags);
    try {
      const result = await operation();
      endMeasure(key);
      return result;
    } catch (error) {
      // Still record timing even if operation failed
      endMeasure(key);
      throw error;
    }
  };
  
  return { startMeasure, endMeasure, measureAsync };
}
