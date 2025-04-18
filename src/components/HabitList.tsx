
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
import { useRef, useCallback, memo, useEffect } from "react";

// Memoize HabitListContent for performance
const MemoizedHabitListContent = memo(HabitListContent);

// Optimized animations
const animationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

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
  
  // Load profile data with optimizations
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
    },
    staleTime: 60000, // 1 minute
    enabled: !isLoading, // Only load profile after habits are loaded
  });
  
  const isMobile = useIsMobile();
  
  // Touch handling refs with optimizations
  const touchStartY = useRef(0);
  const pullDistance = useRef(0);
  const lastRefreshTime = useRef(0);
  const PULL_THRESHOLD = 100;
  const MIN_REFRESH_INTERVAL = 2000;
  
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
    
    if (pullDistance.current > 0 && pullDistance.current < PULL_THRESHOLD) {
      e.preventDefault();
      
      const element = e.currentTarget as HTMLDivElement;
      element.style.transform = `translateY(${pullDistance.current}px)`;
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

  // Enable priority loading for habits
  useEffect(() => {
    document.body.dataset.loadPriority = "high";
    
    return () => {
      delete document.body.dataset.loadPriority;
    };
  }, []);
  
  if (isLoading) {
    return <HabitListLoading />;
  }
  
  if (habits.length === 0) {
    return <HabitListEmpty onAddHabit={addHabit} />;
  }
  
  return (
    <div 
      className="w-full space-y-8 pb-10" 
      onTouchStart={isMobile ? handleTouchStart : undefined} 
      onTouchMove={isMobile ? handleTouchMove : undefined} 
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <AnimatePresence>
        {!isOnline && (
          <motion.div {...animationConfig} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline Mode</span>
            </div>
          </motion.div>
        )}
        
        {/* Only show refresh indicator when actually fetching */}
        {isFetching && (
          <motion.div {...animationConfig} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
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
          transition={{ delay: 0.2 }}
          className="mt-12 max-w-xl mx-auto"
        >
          <AddHabitForm onAddHabit={addHabit} />
        </motion.div>
      </div>
    </div>
  );
}
