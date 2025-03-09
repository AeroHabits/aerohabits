
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { supabase } from '@/integrations/supabase/client';

export function NetworkRecoveryHandler() {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [sessionCheckInProgress, setSessionCheckInProgress] = useState(false);

  // Handle transitions from offline to online
  useEffect(() => {
    if (isOnline && wasOffline) {
      toast.success("Connection restored", {
        description: "Your internet connection has been re-established"
      });
      
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
        
        // Attempt to refresh session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          console.error("Failed to refresh session after reconnect:", refreshError);
          
          // Redirect to auth if multiple session checks fail
          if (window.location.pathname !== '/auth') {
            toast.error("Session expired", {
              description: "Please sign in again to continue",
              action: {
                label: "Sign In",
                onClick: () => window.location.href = '/auth'
              }
            });
          }
        } else {
          console.log("Session successfully refreshed after reconnect");
        }
      } else {
        console.log("Session verified after reconnect:", session ? "Valid" : "Not found");
      }
    } catch (error) {
      console.error("Exception during session verification after reconnect:", error);
    } finally {
      setSessionCheckInProgress(false);
    }
  };

  // Component doesn't render anything visually
  return null;
}
