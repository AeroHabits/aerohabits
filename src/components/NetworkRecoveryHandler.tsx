
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';
import { useErrorTracking } from '@/hooks/useErrorTracking';

export function NetworkRecoveryHandler() {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [sessionCheckInProgress, setSessionCheckInProgress] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { trackError } = useErrorTracking();
  
  // Clear notification timeouts on unmount
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];
    
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Handle transitions from offline to online
  useEffect(() => {
    let notificationTimeoutId: NodeJS.Timeout;
    
    if (isOnline && wasOffline) {
      // Small delay before showing toast to ensure connection is stable
      notificationTimeoutId = setTimeout(() => {
        toast.success("Connection restored", {
          description: "Your internet connection has been re-established"
        });
      }, 1000);
      
      // Reset reconnect attempts when connection is fully restored
      setReconnectAttempts(0);
      
      // Verify session is still valid after coming back online
      verifyAuthSessionAfterReconnect();
    } else if (!isOnline && !wasOffline) {
      // Only show the offline toast after a short delay to prevent flickering
      notificationTimeoutId = setTimeout(() => {
        toast.error("Connection lost", {
          description: "You are currently offline. Some features may be unavailable."
        });
      }, 2000);
    }
    
    setWasOffline(!isOnline);
    
    return () => {
      if (notificationTimeoutId) clearTimeout(notificationTimeoutId);
    };
  }, [isOnline, wasOffline]);

  // Verify auth session after network reconnection
  const verifyAuthSessionAfterReconnect = useCallback(async () => {
    if (sessionCheckInProgress) return;
    
    try {
      setSessionCheckInProgress(true);
      
      // Wait briefly to allow network to stabilize
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error verifying session after reconnect:", error);
        trackError(error, "verifySessionAfterReconnect", { 
          severity: "medium",
          silent: true
        });
        
        // Attempt to refresh session with progressive backoff
        await refreshSessionWithRetry();
      } else if (session) {
        console.log("Session verified after reconnect:", session.user?.id);
        
        // Periodically refresh the token to ensure it stays valid
        // This helps prevent unexpected logouts
        const refreshTimer = setTimeout(() => {
          supabase.auth.refreshSession();
        }, 60000); // Refresh after 1 minute
        
        return () => clearTimeout(refreshTimer);
      } else {
        console.log("No active session found after reconnect");
      }
    } catch (error) {
      console.error("Exception during session verification after reconnect:", error);
      trackError(error instanceof Error ? error : new Error(String(error)), 
                "sessionVerificationException", { 
                  severity: "medium", 
                  silent: true 
                });
      
      // Attempt to recover from unexpected errors
      if (reconnectAttempts < 3) {
        setReconnectAttempts(prev => prev + 1);
        setTimeout(verifyAuthSessionAfterReconnect, 3000 * (reconnectAttempts + 1));
      }
    } finally {
      setSessionCheckInProgress(false);
    }
  }, [sessionCheckInProgress, reconnectAttempts, trackError]);
  
  // Attempt to refresh session with retry logic
  const refreshSessionWithRetry = useCallback(async (attempt = 0) => {
    if (attempt >= 3) {
      console.error("Failed to refresh session after multiple attempts");
      
      // Only show sign in toast when not already on auth page
      if (window.location.pathname !== '/auth') {
        toast.error("Session expired", {
          description: "Please sign in again to continue",
          action: {
            label: "Sign In",
            onClick: () => window.location.href = '/auth'
          }
        });
      }
      return;
    }
    
    try {
      // Add a small delay before retry to give network time to stabilize
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        console.error("Failed to refresh session, retrying:", refreshError);
        
        // Exponential backoff for retries
        setTimeout(() => {
          refreshSessionWithRetry(attempt + 1);
        }, Math.pow(2, attempt) * 1000);
      } else {
        console.log("Session successfully refreshed after reconnect");
      }
    } catch (error) {
      console.error("Exception during session refresh:", error);
      trackError(error instanceof Error ? error : new Error(String(error)), 
                "sessionRefreshException", { 
                  severity: "medium", 
                  silent: true 
                });
                
      setTimeout(() => {
        refreshSessionWithRetry(attempt + 1);
      }, Math.pow(2, attempt) * 1000);
    }
  }, [trackError]);

  // Component doesn't render anything visually
  return null;
}
