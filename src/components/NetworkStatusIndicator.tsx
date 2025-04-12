
import { useDetailedConnectionStatus } from "@/hooks/useOnlineStatus";
import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

export function NetworkStatusIndicator() {
  const connectionStatus = useDetailedConnectionStatus();
  const [showDetails, setShowDetails] = useState(false);
  
  // Don't display network indicators on the frontend for users
  // We'll still use toast notifications for critical connection issues
  // but won't show any persistent UI elements
  
  // Only display critical connection issues via toast
  useEffect(() => {
    // Show toast only for complete connection loss, not for poor connections
    if (!connectionStatus.isOnline) {
      toast.warning("Connection lost", {
        description: "Working offline. Changes will sync when connection is restored.",
        duration: 5000,
        id: "connection-lost" // Prevent duplicate toasts
      });
    }
  }, [connectionStatus.isOnline]);
  
  // Hidden component - not displaying anything to users
  return null;
}
