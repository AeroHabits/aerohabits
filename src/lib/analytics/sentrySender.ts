
import * as Sentry from "@sentry/react";

// Send event data to Sentry
export const sendToSentry = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  properties?: Record<string, any>
) => {
  const eventData = {
    category,
    action,
    label,
    value,
    ...properties
  };
  
  // Log event to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventData);
  }
  
  // Send to Sentry for monitoring
  try {
    // Send as custom event
    Sentry.captureEvent({
      message: `${category}.${action}${label ? `.${label}` : ''}`,
      level: category === 'error' ? 'error' : 'info',
      extra: eventData
    });
    
    // Also track as metric for dashboards
    if (value !== undefined) {
      Sentry.metrics.distribution(
        `app.${category}.${action}`, 
        value,
        { tags: label ? { label } : undefined }
      );
    }
  } catch (error) {
    console.error('Error sending analytics:', error);
  }
};
