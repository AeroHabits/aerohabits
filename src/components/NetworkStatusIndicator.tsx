
import { useNetworkQuality } from "@/hooks/useNetworkQuality";
import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function NetworkStatusIndicator() {
  const { networkQuality, isOnline } = useNetworkQuality();
  const [showDetails, setShowDetails] = useState(false);
  
  // Get the detailed connection status
  const connectionStatus = useNetworkQuality();
  
  // Only display the component when not online or when connection is poor
  const shouldDisplay = !isOnline || networkQuality === 'poor';
  
  // Auto-hide the component after a delay when connection is restored
  useEffect(() => {
    if (isOnline && networkQuality !== 'poor') {
      const timeoutId = setTimeout(() => {
        setShowDetails(false);
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOnline, networkQuality]);
  
  if (!shouldDisplay && !showDetails) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "fixed bottom-20 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-all duration-300 hover:scale-105",
              !isOnline && "bg-red-100 text-red-700 border-red-300",
              isOnline && networkQuality === 'poor' && "bg-amber-100 text-amber-700 border-amber-300",
              isOnline && networkQuality !== 'poor' && "bg-green-100 text-green-700 border-green-300"
            )}
            onClick={() => setShowDetails(!showDetails)}
          >
            {!isOnline && (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Offline</span>
              </>
            )}
            
            {isOnline && networkQuality === 'poor' && (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Poor Connection</span>
              </>
            )}
            
            {isOnline && networkQuality !== 'poor' && (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Online</span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="w-64 p-3">
          <div className="space-y-2">
            <p className="font-semibold">
              Network Status: {isOnline ? (
                networkQuality === 'good' ? 'Good' :
                networkQuality === 'acceptable' ? 'Acceptable' : 'Poor'
              ) : 'Offline'}
            </p>
            
            {connectionStatus.networkQuality !== 'offline' && connectionStatus.latency && (
              <p className="text-sm">
                Latency: {connectionStatus.latency.toFixed(0)}ms
              </p>
            )}
            
            {connectionStatus.networkQuality !== 'offline' && connectionStatus.downlinkSpeed && (
              <p className="text-sm">
                Speed: {connectionStatus.downlinkSpeed.toFixed(1)} Mbps
              </p>
            )}
            
            {connectionStatus.networkQuality !== 'offline' && (
              <p className="text-sm">
                Reliability: {connectionStatus.reliability}%
              </p>
            )}
            
            <p className="text-xs text-muted-foreground">
              Last checked: {new Date(connectionStatus.lastChecked).toLocaleTimeString()}
            </p>
            
            {!isOnline && (
              <p className="text-xs text-red-600 mt-2">
                Working offline. Changes will sync when connection is restored.
              </p>
            )}
            
            {isOnline && networkQuality === 'poor' && (
              <p className="text-xs text-amber-600 mt-2">
                Using power-saving mode. Non-critical operations delayed.
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
