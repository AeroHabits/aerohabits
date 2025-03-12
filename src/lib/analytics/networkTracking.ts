
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from './core';

/**
 * Tracks network status changes and quality
 */
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
