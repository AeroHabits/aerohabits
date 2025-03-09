
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApiOptions {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
  criticalRequest?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: 'success' | 'error' | 'timeout';
}

/**
 * Enhanced API request wrapper with retry logic, timeouts, and toast notifications
 */
export const enhancedApiRequest = async <T>(
  requestFn: () => Promise<{ data: T | null; error: any }>,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    showSuccessToast = false,
    successMessage = 'Operation completed successfully',
    showErrorToast = true,
    errorMessage = 'An error occurred',
    retryCount = 2,
    retryDelay = 1000,
    timeout = 10000,
    criticalRequest = false
  } = options;

  let attempts = 0;
  
  // Set up timeout promise
  const timeoutPromise = new Promise<ApiResponse<T>>((_, reject) => {
    setTimeout(() => {
      reject({ data: null, error: new Error('Request timed out'), status: 'timeout' });
    }, timeout);
  });

  // Retry function
  const executeWithRetry = async (): Promise<ApiResponse<T>> => {
    try {
      // Try to execute the request
      const response = await requestFn();
      
      if (response.error) {
        throw response.error;
      }
      
      // Success case
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      return { data: response.data, error: null, status: 'success' };
    } catch (error) {
      attempts++;
      
      // Log error details
      console.error(`API request failed (attempt ${attempts}/${retryCount + 1}):`, error);
      
      // Check if we should retry
      if (attempts <= retryCount) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempts - 1)));
        return executeWithRetry();
      }
      
      // All retries exhausted
      if (showErrorToast) {
        toast.error(errorMessage, {
          description: error instanceof Error ? error.message : 'Please try again later'
        });
      }
      
      // For critical requests, try to reconnect Supabase if we suspect auth issues
      if (criticalRequest) {
        try {
          // Attempt to refresh the session
          await supabase.auth.refreshSession();
        } catch (refreshError) {
          console.error('Failed to refresh session:', refreshError);
        }
      }
      
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error)), 
        status: 'error' 
      };
    }
  };

  // Execute with timeout
  try {
    return await Promise.race([executeWithRetry(), timeoutPromise]);
  } catch (raceError) {
    // Handle timeout case
    if (showErrorToast && (raceError as any)?.status === 'timeout') {
      toast.error('Request timed out', {
        description: 'Please check your connection and try again'
      });
    }
    
    return raceError as ApiResponse<T>;
  }
};

/**
 * Enhanced background job executor that doesn't block UI
 */
export const runBackgroundJob = <T>(
  jobFn: () => Promise<T>,
  onComplete?: (result: T) => void,
  onError?: (error: Error) => void
) => {
  // Use requestAnimationFrame to not block the UI thread
  requestAnimationFrame(() => {
    jobFn()
      .then(result => {
        if (onComplete) onComplete(result);
      })
      .catch(error => {
        console.error('Background job failed:', error);
        if (onError) onError(error instanceof Error ? error : new Error(String(error)));
      });
  });
};
