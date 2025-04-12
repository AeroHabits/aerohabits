
export const SYNC_QUEUE_KEY = 'habitSyncQueue';
export const BATCH_SIZE = 50; // Batch size for processing sync operations
export const SYNC_DEBOUNCE_MS = 2000; // Debounce time for sync operations
export const MAX_RETRY_ATTEMPTS = 5; // Maximum retry attempts for failed operations

// Exponential backoff configuration
export const BACKOFF_CONFIG = {
  BASE_DELAY: 1000, // 1 second
  MAX_JITTER: 500, // 0.5 second jitter
  MAX_DELAY: 30000, // Cap at 30 seconds
};
