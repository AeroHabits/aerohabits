
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, WifiOff, RefreshCw } from "lucide-react";

interface NetworkStatusIndicatorProps {
  isOnline: boolean;
  networkQuality: string;
  refreshing: boolean;
  isFetching: boolean;
}

export function NetworkStatusIndicator({ 
  isOnline, 
  networkQuality, 
  refreshing, 
  isFetching 
}: NetworkStatusIndicatorProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }} 
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Offline Mode</span>
          </div>
        </motion.div>
      )}
      
      {networkQuality === 'poor' && isOnline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }} 
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm font-medium">Slow Connection</span>
          </div>
        </motion.div>
      )}
      
      {(refreshing || isFetching) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }} 
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Refreshing...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
