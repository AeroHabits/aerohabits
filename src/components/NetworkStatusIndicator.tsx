
import { useDetailedConnectionStatus } from "@/hooks/useOnlineStatus";
import { useEffect } from "react";
import { toast } from "sonner";

export function NetworkStatusIndicator() {
  const connectionStatus = useDetailedConnectionStatus();
  
  // Only show toast for complete connection loss
  useEffect(() => {
    // Prevent toast from showing on first render
    const hasShownOfflineToast = sessionStorage.getItem('has-shown-offline-toast');
    
    if (!connectionStatus.isOnline && !hasShownOfflineToast) {
      toast.warning("Connection lost", {
        description: "Working offline. Changes will sync when connection is restored.",
        duration: 5000,
        id: "connection-lost" // Prevent duplicate toasts
      });
      sessionStorage.setItem('has-shown-offline-toast', 'true');
    } else if (connectionStatus.isOnline) {
      // Reset flag when back online
      sessionStorage.removeItem('has-shown-offline-toast');
    }
  }, [connectionStatus.isOnline]);
  
  // Return null to prevent any rendering
  return null;
}
