
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from './core';

/**
 * Web Vitals metrics for measuring performance
 */
type Metric = {
  name: string;
  value: number;
  delta: number;
  id: string;
  entries?: any[];
};

/**
 * Tracks application performance metrics
 */
export const trackPerformance = (
  label: string, 
  duration: number,
  properties?: Record<string, any>
) => {
  trackEvent(
    EVENT_CATEGORIES.APP_PERFORMANCE,
    EVENT_ACTIONS.LOAD,
    label,
    duration,
    properties
  );
};

/**
 * Send web vitals metrics to analytics
 */
export const reportWebVitals = (metric: Metric) => {
  // Only report metrics on production or when explicitly testing performance
  if (process.env.NODE_ENV !== 'production' && !window.location.search.includes('measure-performance')) {
    return;
  }

  // iOS detection - reduce tracking on iOS devices
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  // For iOS, only send critical metrics and sample at 10%
  if (isIOS && Math.random() > 0.1) {
    return;
  }

  // Format the metric for analytics - using replace with regex instead of replaceAll
  const name = metric.name.replace(/-/g, '_');
  const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);

  trackEvent(
    EVENT_CATEGORIES.WEB_VITALS,
    EVENT_ACTIONS.MEASURE,
    name,
    value,
    {
      metric_id: metric.id,
      metric_delta: Math.round(metric.delta)
    }
  );
};

/**
 * Measure a specific operation's performance
 */
export const measureOperation = async <T>(
  name: string,
  operation: () => Promise<T> | T
): Promise<T> => {
  const startTime = performance.now();
  try {
    return await Promise.resolve(operation());
  } finally {
    const duration = performance.now() - startTime;
    
    // Only track operations that take more than 100ms
    if (duration > 100) {
      trackPerformance(`operation_${name}`, Math.round(duration));
    }
  }
};
