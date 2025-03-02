
// Enhanced analytics system for tracking user behavior and app performance
import * as Sentry from "@sentry/react";

// Define event categories for consistent tracking
export const EVENT_CATEGORIES = {
  PAGE_VIEW: 'page_view',
  USER_ACTION: 'user_action',
  APP_PERFORMANCE: 'app_performance',
  ERROR: 'error',
  SYNC: 'sync',
  NETWORK: 'network',
  HABIT: 'habit',
  GOAL: 'goal',
  CHALLENGE: 'challenge'
} as const;

// Define event actions for consistent tracking
export const EVENT_ACTIONS = {
  // User actions
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  COMPLETE: 'complete',
  VIEW: 'view',
  CLICK: 'click',
  
  // Performance and system events
  LOAD: 'load',
  ERROR: 'error',
  WARNING: 'warning',
  SYNC_START: 'sync_start',
  SYNC_COMPLETE: 'sync_complete',
  SYNC_ERROR: 'sync_error',
  CACHE_HIT: 'cache_hit',
  CACHE_MISS: 'cache_miss',
  NETWORK_CHANGE: 'network_change',
  BATCH_OPERATION: 'batch_operation'
} as const;

// Track sampling rates to avoid overwhelming analytics in high-traffic situations
const SAMPLING_RATES = {
  PAGE_VIEW: 1.0,        // Track all page views
  USER_ACTION: 0.8,      // Track 80% of user actions
  APP_PERFORMANCE: 0.5,  // Track 50% of performance events
  ERROR: 1.0,            // Track all errors
  SYNC: 0.7,             // Track 70% of sync events
  NETWORK: 0.5,          // Track 50% of network events
  HABIT: 0.8,            // Track 80% of habit actions
  GOAL: 0.8,             // Track 80% of goal actions
  CHALLENGE: 0.8         // Track 80% of challenge actions
};

// Memory cache to avoid duplicate events in short time periods
const eventCache = new Map<string, number>();
const EVENT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Clean up event cache periodically
setInterval(() => {
  const now = Date.now();
  eventCache.forEach((timestamp, key) => {
    if (now - timestamp > EVENT_CACHE_DURATION) {
      eventCache.delete(key);
    }
  });
}, 15 * 60 * 1000); // Clean every 15 minutes

// Determine if an event should be sampled based on category
const shouldSampleEvent = (category: string): boolean => {
  const rate = SAMPLING_RATES[category as keyof typeof SAMPLING_RATES] || 1.0;
  return Math.random() <= rate;
};

// Main tracking function
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  properties?: Record<string, any>,
  options?: {
    deduplicationKey?: string;
    deduplicationWindow?: number;
    forceSample?: boolean;
  }
) => {
  const { 
    deduplicationKey, 
    deduplicationWindow = EVENT_CACHE_DURATION,
    forceSample = false
  } = options || {};
  
  // Check for duplicate events if deduplicationKey is provided
  if (deduplicationKey) {
    const cacheKey = `${category}:${action}:${deduplicationKey}`;
    const lastTimestamp = eventCache.get(cacheKey);
    
    if (lastTimestamp && Date.now() - lastTimestamp < deduplicationWindow) {
      return; // Skip duplicate event
    }
    
    // Update event cache
    eventCache.set(cacheKey, Date.now());
  }
  
  // Apply sampling unless forced
  if (!forceSample && !shouldSampleEvent(category)) {
    return;
  }
  
  // Prepare data for analytics
  const eventData = {
    category,
    action,
    label,
    value,
    ...properties
  };
  
  // Log event to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventData);
  }
  
  // Send to Sentry for monitoring
  try {
    // Send as custom event
    Sentry.captureEvent({
      message: `${category}.${action}${label ? `.${label}` : ''}`,
      level: category === EVENT_CATEGORIES.ERROR ? 'error' : 'info',
      extra: eventData
    });
    
    // Also track as metric for dashboards
    if (value !== undefined) {
      // Fixed: use tags object instead of label
      Sentry.metrics.distribution(
        `app.${category}.${action}`, 
        value,
        { tags: label ? { eventLabel: label } : undefined }
      );
    }
  } catch (error) {
    console.error('Error sending analytics:', error);
  }
};

// Specific tracking methods
export const trackPageView = (path: string) => {
  trackEvent(
    EVENT_CATEGORIES.PAGE_VIEW, 
    EVENT_ACTIONS.VIEW,
    path
  );
};

export const trackHabitAction = (
  action: 'create' | 'complete' | 'delete' | 'update', 
  habitTitle: string,
  properties?: Record<string, any>
) => {
  trackEvent(
    EVENT_CATEGORIES.HABIT,
    action.toUpperCase(),
    habitTitle,
    undefined,
    properties
  );
};

export const trackGoalAction = (
  action: 'create' | 'complete' | 'delete' | 'update', 
  goalTitle: string,
  properties?: Record<string, any>
) => {
  trackEvent(
    EVENT_CATEGORIES.GOAL,
    action.toUpperCase(),
    goalTitle,
    undefined,
    properties
  );
};

export const trackSyncOperation = (
  action: 'start' | 'complete' | 'error',
  itemCount: number,
  duration?: number,
  properties?: Record<string, any>
) => {
  trackEvent(
    EVENT_CATEGORIES.SYNC,
    action === 'start' 
      ? EVENT_ACTIONS.SYNC_START 
      : action === 'complete' 
        ? EVENT_ACTIONS.SYNC_COMPLETE 
        : EVENT_ACTIONS.SYNC_ERROR,
    undefined,
    duration,
    {
      itemCount,
      ...properties
    },
    {
      deduplicationKey: action === 'start' ? 'sync_operation' : undefined
    }
  );
};

export const trackNetworkChange = (
  status: 'online' | 'offline' | 'poor' | 'good',
  properties?: Record<string, any>
) => {
  trackEvent(
    EVENT_CATEGORIES.NETWORK,
    EVENT_ACTIONS.NETWORK_CHANGE,
    status,
    undefined,
    properties,
    {
      deduplicationKey: `network_${status}`,
      deduplicationWindow: 5 * 60 * 1000 // 5 minutes
    }
  );
};

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

export const trackError = (
  errorMessage: string,
  source: string,
  properties?: Record<string, any>
) => {
  trackEvent(
    EVENT_CATEGORIES.ERROR,
    EVENT_ACTIONS.ERROR,
    source,
    undefined,
    {
      errorMessage,
      ...properties
    },
    { forceSample: true } // Always track errors
  );
};

// Initialize analytics system
export const initAnalytics = () => {
  // Track initial page load
  trackPageView(window.location.pathname);
  
  // Track initial network status
  trackNetworkChange(navigator.onLine ? 'online' : 'offline');
};
