
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
export const SAMPLING_RATES = {
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
