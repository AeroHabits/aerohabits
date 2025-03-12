
import { trackEvent, EVENT_CATEGORIES, EVENT_ACTIONS } from './core';

/**
 * Tracks application errors
 */
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
