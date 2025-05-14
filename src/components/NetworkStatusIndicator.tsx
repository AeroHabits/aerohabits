
import { useDetailedConnectionStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function NetworkStatusIndicator() {
  // Guard against non-browser environments
  const isClient = typeof window !== 'undefined';
  
  // If not in browser, return null immediately
  if (!isClient) return null;
  
  const connectionStatus = useDetailedConnectionStatus();
  const previousStatus = useRef(connectionStatus.isOnline);
  const toastIdRef = useRef<string | number | null>(null);
  
  // Only show toast for complete connection changes
  useEffect(() => {
    // Don't show toast on first render (only on changes)
    if (previousStatus.current !== connectionStatus.isOnline) {
      // Clear any existing toasts to prevent duplicates
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      
      if (!connectionStatus.isOnline) {
        // Offline toast
        toastIdRef.current = toast.warning("Connection lost", {
          description: "Working offline. Changes will sync when connection is restored.",
          duration: 5000,
          id: "connection-lost" // Prevent duplicate toasts
        });
      } else if (previousStatus.current === false) {
        // Only show online toast if we were previously offline
        toastIdRef.current = toast.success("Connection restored", {
          description: "Your changes will now sync to the cloud.",
          duration: 3000,
          id: "connection-restored"
        });
        
        // Clear the reference after showing
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
      }
      
      // Update previous status
      previousStatus.current = connectionStatus.isOnline;
    }
  }, [connectionStatus.isOnline]);
  
  // Return null to prevent any rendering
  return null;
}
