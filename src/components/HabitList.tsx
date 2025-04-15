
import { AddHabitForm } from "./AddHabitForm";
import { HabitListEmpty } from "./HabitListEmpty";
import { HabitListLoading } from "./HabitListLoading";
import { HabitListContent } from "./HabitListContent";
import { useHabits } from "@/hooks/useHabits";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, WifiOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useRef, useCallback, memo } from "react";

// Detect iOS platform
const isIOS = typeof navigator !== 'undefined' && 
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

// Memoize HabitListContent for performance
const MemoizedHabitListContent = memo(HabitListContent);

export function HabitList() {
  const {
    habits,
    isLoading,
    habitToDelete,
    setHabitToDelete,
    deleteHabit,
    toggleHabit,
    addHabit,
    refetch,
    isFetching,
    isOnline
  } = useHabits();
  
  // Load profile data with iOS optimizations
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
    },
    staleTime: isIOS ? 300000 : 60000, // 5 minutes on iOS vs 1 minute
    enabled: !isLoading, // Only load profile after habits are loaded
    refetchOnWindowFocus: !isIOS // Disable refetch on window focus for iOS
  });
  
  const isMobile = useIsMobile();
  
  // Touch handling refs with optimizations
  const touchStartY = useRef(0);
  const pullDistance = useRef(0);
  const lastRefreshTime = useRef(0);
  const PULL_THRESHOLD = 100;
  const MIN_REFRESH_INTERVAL = isIOS ? 5000 : 2000; // Longer interval on iOS
  
  // Optimized touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === 0) return;
    const currentY = e.touches[0].clientY;
    pullDistance.current = currentY - touchStartY.current;
    
    // Throttle UI updates on iOS for better performance
    if (pullDistance.current > 0 && pullDistance.current < PULL_THRESHOLD) {
      // Skip preventDefault on iOS for better scrolling performance
      if (!isIOS) e.preventDefault();
      
      const element = e.currentTarget as HTMLDivElement;
      // iOS optimization: only update transform every 2px of movement
      if (!isIOS || Math.round(pullDistance.current) % 2 === 0) {
        element.style.transform = `translateY(${pullDistance.current}px)`;
      }
    }
  }, []);
  
  const handleTouchEnd = useCallback(async (e: React.TouchEvent) => {
    const now = Date.now();
    const element = e.currentTarget as HTMLDivElement;
    
    if (pullDistance.current > PULL_THRESHOLD / 2) {
      if (now - lastRefreshTime.current > MIN_REFRESH_INTERVAL) {
        await refetch();
        lastRefreshTime.current = now;
      }
    }
    
    element.style.transform = '';
    touchStartY.current = 0;
    pullDistance.current = 0;
  }, [refetch]);
  
  if (isLoading) {
    return <HabitListLoading />;
  }
  
  if (habits.length === 0) {
    return <HabitListEmpty onAddHabit={addHabit} />;
  }

  // iOS optimized animations: simpler and fewer
  const simpleAnimation = isIOS ? { 
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  } : {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  return (
    <div 
      className="w-full space-y-8 pb-10" 
      onTouchStart={isMobile ? handleTouchStart : undefined} 
      onTouchMove={isMobile ? handleTouchMove : undefined} 
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <AnimatePresence>
        {!isOnline && (
          <motion.div {...simpleAnimation} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline Mode</span>
            </div>
          </motion.div>
        )}
        
        {/* Only show refresh indicator when actually fetching */}
        {isFetching && (
          <motion.div {...simpleAnimation} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Refreshing...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Memoized component to prevent unnecessary re-renders */}
        <MemoizedHabitListContent 
          habits={habits} 
          onToggle={toggleHabit} 
          onDelete={deleteHabit} 
          setHabitToDelete={setHabitToDelete} 
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isIOS ? 0.1 : 0.3 }}
          className="mt-12 max-w-xl mx-auto"
        >
          <AddHabitForm onAddHabit={addHabit} />
        </motion.div>
      </div>
    </div>
  );
}
