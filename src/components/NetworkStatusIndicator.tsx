
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
  
  // Only display the component when not online
  const shouldDisplay = !connectionStatus.isOnline;
  const isPoorConnection = connectionStatus.isOnline && connectionStatus.quality === 'poor';
  
  // Notify of poor connection with toast instead of permanent UI element
  useEffect(() => {
    // Only show toast for poor connection once it's confirmed
    if (isPoorConnection && connectionStatus.latency !== null) {
      toast.warning("Poor network connection detected", {
        description: "Some features may be slower than usual",
        duration: 5000,
        id: "poor-connection" // Prevent duplicate toasts
      });
    }
  }, [isPoorConnection, connectionStatus.quality]);
  
  // Auto-hide the component after a delay when connection is restored
  useEffect(() => {
    if (connectionStatus.isOnline) {
      const timeoutId = setTimeout(() => {
        setShowDetails(false);
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [connectionStatus.isOnline]);
  
  if (!shouldDisplay && !showDetails) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "fixed bottom-20 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-all duration-300 hover:scale-105",
              !connectionStatus.isOnline && "bg-red-100 text-red-700 border-red-300"
            )}
            onClick={() => setShowDetails(!showDetails)}
          >
            {!connectionStatus.isOnline && (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Offline</span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="w-64 p-3">
          <div className="space-y-2">
            <p className="font-semibold">
              Network Status: {connectionStatus.isOnline ? (
                connectionStatus.quality === 'good' ? 'Good' :
                connectionStatus.quality === 'acceptable' ? 'Acceptable' : 'Poor'
              ) : 'Offline'}
            </p>
            
            {connectionStatus.latency && (
              <p className="text-sm">
                Latency: {connectionStatus.latency.toFixed(0)}ms
              </p>
            )}
            
            {connectionStatus.downlinkSpeed && (
              <p className="text-sm">
                Speed: {connectionStatus.downlinkSpeed.toFixed(1)} Mbps
              </p>
            )}
            
            <p className="text-sm">
              Reliability: {connectionStatus.reliability}%
            </p>
            
            <p className="text-xs text-muted-foreground">
              Last checked: {new Date(connectionStatus.lastChecked).toLocaleTimeString()}
            </p>
            
            {!connectionStatus.isOnline && (
              <p className="text-xs text-red-600 mt-2">
                Working offline. Changes will sync when connection is restored.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
