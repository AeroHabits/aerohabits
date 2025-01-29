import Analytics from '@analytics/google-analytics';

// Initialize analytics with error handling
export const analytics = Analytics({
  app: 'areohabits',
  plugins: [
    {
      name: 'google-analytics',
      googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with your GA measurement ID
      init: (config: any) => {
        // Prevent throwing errors if GA ID is not defined
        if (!config.googleAnalyticsId) {
          console.warn('Google Analytics ID not configured');
          return;
        }
      }
    }
  ]
});

// Track page views with error handling
export const trackPageView = (path: string) => {
  try {
    analytics.page({
      url: path,
      title: document.title
    });
  } catch (error) {
    console.warn('Error tracking page view:', error);
  }
};

// Track habit actions with error handling
export const trackHabitAction = (action: 'create' | 'complete' | 'delete', habitTitle: string) => {
  try {
    analytics.track(`habit_${action}`, {
      habitTitle,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Error tracking habit action:', error);
  }
};

// Track goal actions with error handling
export const trackGoalAction = (action: 'create' | 'complete' | 'delete', goalTitle: string) => {
  try {
    analytics.track(`goal_${action}`, {
      goalTitle,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Error tracking goal action:', error);
  }
};