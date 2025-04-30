
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export function GoalListLoading() {
  const isMobile = useIsMobile();
  const skeletonCount = isMobile ? 2 : 3;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-40 bg-gray-700/50" />
        <Skeleton className="h-8 w-28 bg-gray-700/50" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-5 border border-gray-700/60">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-6 w-3/4 bg-gray-700/60" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700/60" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-20 bg-gray-700/60" />
                    <Skeleton className="h-4 w-24 bg-gray-700/60" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-gray-700/60" />
              </div>
              
              <div className="mt-4">
                <Skeleton className="h-2 w-full bg-gray-700/60" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
