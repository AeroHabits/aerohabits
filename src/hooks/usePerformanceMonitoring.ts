
import { useEffect, useRef } from 'react';
import * as Sentry from "@sentry/react";

interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  tags?: Record<string, string | number | boolean>;
}

// Platform-aware performance monitoring
export function usePerformanceMonitoring() {
  const metricsRef = useRef<Map<string, PerformanceMetric>>(new Map());
  const reportThresholds = useRef<Map<string, number>>(new Map([
    ['dataFetch', 1000],       // 1 second for data fetches (reduced from 2s)
    ['rendering', 300],        // 300ms for rendering operations (reduced from 500ms)
    ['interaction', 50],       // 50ms for user interactions (reduced from 100ms)
    ['processing', 500],       // 500ms for data processing (reduced from 1s)
    ['synchronization', 3000], // 3 seconds for sync operations (reduced from 5s)
  ]));

  // Detect iOS platform
  const isIOS = useRef(typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  );

  // Report metrics every 60 seconds on mobile to reduce background processing and battery usage
  useEffect(() => {
    if (!isIOS.current) return; // Only apply iOS-specific optimizations if on iOS
    
    const reportInterval = setInterval(() => {
      if (metricsRef.current.size === 0) return;
      
      // Create a batch of metrics to report
      const metricsToReport: PerformanceMetric[] = [];
      const metricsToKeep = new Map<string, PerformanceMetric>();
      
      metricsRef.current.forEach((metric, key) => {
        // Only report completed metrics
        if (metric.duration !== undefined) {
          // For iOS, only report metrics that exceed thresholds to reduce analytics load
          const threshold = reportThresholds.current.get(metric.name.split('.')[0]) || 500;
          if (metric.duration > threshold) {
            metricsToReport.push(metric);
          }
        } else {
          // Keep in-progress metrics
          metricsToKeep.set(key, metric);
        }
      });
      
      if (metricsToReport.length > 0) {
        // Report to Sentry Performance Monitoring - batch report to reduce network calls
        Sentry.withScope(scope => {
          // Add all metrics to a single scope to reduce overhead
          metricsToReport.forEach(metric => {
            if (metric.duration) {
              // Use sampling for iOS devices - only send 20% of metrics
              if (Math.random() < 0.2) {
                Sentry.metrics.distribution(
                  `app.performance.${metric.name}`, 
                  metric.duration,
                  metric.tags
                );
              }
              
              // Only log extremely slow operations for debugging
              const threshold = reportThresholds.current.get(metric.name.split('.')[0]) || 500;
              if (metric.duration > threshold * 3) { // Only log if three times as slow as threshold
                console.warn(`Slow operation detected: ${metric.name} took ${metric.duration}ms`, metric.tags);
              }
            }
          });
        });
        
        // Reset to only keep in-progress metrics
        metricsRef.current = metricsToKeep;
      }
    }, 60000); // Report every 60 seconds on mobile instead of 30s
    
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
      endMeasure(key);
      throw error;
    }
  };
  
  return { startMeasure, endMeasure, measureAsync };
}
