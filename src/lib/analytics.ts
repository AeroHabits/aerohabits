import Analytics from '@analytics/google-analytics';

// Initialize analytics
export const analytics = Analytics({
  app: 'areohabits',
  plugins: [
    {
      name: 'google-analytics',
      googleAnalyticsId: 'G-XXXXXXXXXX' // Replace with your GA measurement ID
    }
  ]
});

// Track page views
export const trackPageView = (path: string) => {
  analytics.page({
    url: path,
    title: document.title
  });
};

// Track habit actions
export const trackHabitAction = (action: 'create' | 'complete' | 'delete', habitTitle: string) => {
  analytics.track(`habit_${action}`, {
    habitTitle,
    timestamp: new Date().toISOString()
  });
};

// Track goal actions
export const trackGoalAction = (action: 'create' | 'complete' | 'delete', goalTitle: string) => {
  analytics.track(`goal_${action}`, {
    goalTitle,
    timestamp: new Date().toISOString()
  });
};