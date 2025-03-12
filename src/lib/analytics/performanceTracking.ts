
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from './core';

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
