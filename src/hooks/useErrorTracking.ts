
import * as Sentry from "@sentry/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type ErrorSeverity = "low" | "medium" | "high" | "critical";

interface ErrorOptions {
  severity?: ErrorSeverity;
  context?: Record<string, any>;
  silent?: boolean;
  retry?: () => Promise<any>;
  fallbackData?: any;
}

export function useErrorTracking() {
  const [errorCount, setErrorCount] = useState<Record<string, number>>({});
  const [lastErrors, setLastErrors] = useState<Record<string, Date>>({});
  
  // Clear error counts periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Reset error counts that haven't occurred in the last hour
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      setLastErrors(prev => {
        const newLastErrors = {...prev};
        let hasChanges = false;
        
        Object.entries(prev).forEach(([key, timestamp]) => {
          if (timestamp < oneHourAgo) {
            delete newLastErrors[key];
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          // Also clean up error counts for removed errors
          setErrorCount(prev => {
            const newCounts = {...prev};
            Object.keys(prev).forEach(key => {
              if (!newLastErrors[key]) {
                delete newCounts[key];
              }
            });
            return newCounts;
          });
        }
        
        return hasChanges ? newLastErrors : prev;
      });
    }, 30 * 60 * 1000); // Run every 30 minutes
    
    return () => clearInterval(intervalId);
  }, []);
  
  const trackError = (
    error: Error | string,
    operationName: string,
    options: ErrorOptions = {}
  ) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorKey = `${operationName}:${errorMessage.substring(0, 50)}`;
    const { 
      severity = "medium", 
      context = {}, 
      silent = false,
      retry,
      fallbackData
    } = options;
    
    // Update error counts for rate limiting
    setErrorCount(prev => ({
      ...prev,
      [errorKey]: (prev[errorKey] || 0) + 1
    }));
    
    setLastErrors(prev => ({
      ...prev,
      [errorKey]: new Date()
    }));
    
    // Determine if we should report to Sentry based on severity and frequency
    const errorFrequency = errorCount[errorKey] || 1;
    const shouldReportToSentry = 
      severity === "critical" || 
      severity === "high" ||
      (severity === "medium" && errorFrequency <= 5) ||
      (severity === "low" && errorFrequency === 1);
    
    if (shouldReportToSentry) {
      Sentry.captureException(typeof error === 'string' ? new Error(error) : error, {
        tags: {
          severity,
          operationName
        },
        extra: {
          ...context,
          errorFrequency
        }
      });
    }
    
    // Log to console in development
    console.error(`[${severity}] Error in ${operationName}:`, error, context);
    
    // Show user-facing toast for important errors, unless silent is true
    if (!silent && (severity === "high" || severity === "critical")) {
      const actionButton = retry ? {
        label: "Retry",
        onClick: () => {
          toast.promise(retry(), {
            loading: "Retrying...",
            success: "Operation completed successfully",
            error: "Retry failed"
          });
        }
      } : undefined;
      
      toast.error(
        `Something went wrong${operationName ? ' with ' + operationName : ''}. ${errorFrequency > 3 ? 'We\'re working on it.' : 'Please try again later.'}`,
        { action: actionButton }
      );
    }
    
    return fallbackData;
  };
  
  return { trackError };
}
