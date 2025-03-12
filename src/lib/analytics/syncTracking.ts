
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from './core';

/**
 * Tracks sync operations between online and offline states
 */
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
