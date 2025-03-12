
import { trackEvent } from './core';
import { EVENT_CATEGORIES } from './core';

/**
 * Tracks habit-related actions like creating, completing, updating, or deleting habits
 */
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
