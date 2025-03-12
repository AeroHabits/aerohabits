
import { EVENT_CATEGORIES, EVENT_ACTIONS } from './constants';
import { checkDuplicateEvent } from './eventCache';
import { shouldSampleEvent } from './sampling';
import { sendToSentry } from './sentrySender';
import { trackNetworkChange } from './networkTracking';

// Re-export constants for use elsewhere
export { EVENT_CATEGORIES, EVENT_ACTIONS };

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
    deduplicationWindow,
    forceSample = false
  } = options || {};
  
  // Check for duplicate events
  if (deduplicationKey && checkDuplicateEvent(category, action, deduplicationKey, deduplicationWindow)) {
    return; // Skip duplicate event
  }
  
  // Apply sampling unless forced
  if (!forceSample && !shouldSampleEvent(category)) {
    return;
  }
  
  // Send to analytics service
  sendToSentry(category, action, label, value, properties);
};

// Basic page view tracking
export const trackPageView = (path: string) => {
  trackEvent(
    EVENT_CATEGORIES.PAGE_VIEW, 
    EVENT_ACTIONS.VIEW,
    path
  );
};

// Initialize analytics system
export const initAnalytics = () => {
  // Track initial page load
  trackPageView(window.location.pathname);
  
  // Track initial network status
  trackNetworkChange(navigator.onLine ? 'online' : 'offline');
};
