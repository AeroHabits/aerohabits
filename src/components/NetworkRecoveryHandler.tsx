
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';

export function NetworkRecoveryHandler() {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [sessionCheckInProgress, setSessionCheckInProgress] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Handle transitions from offline to online
  useEffect(() => {
    if (isOnline && wasOffline) {
      toast.success("Connection restored", {
        description: "Your internet connection has been re-established"
      });
      
      // Reset reconnect attempts when connection is fully restored
      setReconnectAttempts(0);
      
      // Verify session is still valid after coming back online
      verifyAuthSessionAfterReconnect();
    }
    
    setWasOffline(!isOnline);
  }, [isOnline, wasOffline]);

  // Handle connection issues
  useEffect(() => {
    if (!isOnline) {
      toast.error("Connection lost", {
        description: "You are currently offline. Some features may be unavailable."
      });
    }
  }, [isOnline]);

  // Verify auth session after network reconnection
  const verifyAuthSessionAfterReconnect = async () => {
    if (sessionCheckInProgress) return;
    
    try {
      setSessionCheckInProgress(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error verifying session after reconnect:", error);
        
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
      // Attempt to recover from unexpected errors
      if (reconnectAttempts < 3) {
        setReconnectAttempts(prev => prev + 1);
        setTimeout(verifyAuthSessionAfterReconnect, 3000 * (reconnectAttempts + 1));
      }
    } finally {
      setSessionCheckInProgress(false);
    }
  };
  
  // Attempt to refresh session with retry logic
  const refreshSessionWithRetry = async (attempt = 0) => {
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
      setTimeout(() => {
        refreshSessionWithRetry(attempt + 1);
      }, Math.pow(2, attempt) * 1000);
    }
  };

  // Component doesn't render anything visually
  return null;
}
