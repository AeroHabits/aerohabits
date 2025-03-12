
import { trackEvent } from './core';
import { EVENT_CATEGORIES } from './core';

/**
 * Tracks goal-related actions like creating, completing, updating, or deleting goals
 */
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
