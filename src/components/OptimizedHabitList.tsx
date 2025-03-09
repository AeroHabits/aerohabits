
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { AddHabitForm } from "./AddHabitForm";
import { HabitListEmpty } from "./HabitListEmpty";
import { HabitListLoading } from "./HabitListLoading";
import { HabitListContent } from "./HabitListContent";
import { useHabitOperations } from "@/hooks/useHabitOperations";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useOptimizedDataFetching } from "@/hooks/useOptimizedDataFetching";
import { Habit } from "@/types";
import { Button } from "./ui/button";

export function OptimizedHabitList() {
  const { deleteHabit, toggleHabit, addHabit, isOnline } = useHabitOperations();
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [refreshing, setRefreshing] = useState(false);
  
  // Optimized fetching for habits
  const {
    data: habits = [],
    isLoading,
    isError,
    isFetching,
    networkQuality,
    refetchOptimized,
    isInitialLoading
  } = useOptimizedDataFetching<Habit[]>({
    queryKey: ["habits", "optimized"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");
      
      const { data, error } = await supabase
        .from('habits')
        .select(`
          *,
          habit_categories (
            id,
            name,
            color,
            icon
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    cachePolicy: 'network-first',
    criticalData: true,
    retryCount: 3,
    staleTime: 60000 // 1 minute
  });
  
  // Get user profile for additional data
  const {
    data: profile
  } = useOptimizedDataFetching({
    queryKey: ['profile', 'optimized'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    cachePolicy: 'cache-first',
    staleTime: 300000 // 5 minutes
  });
  
  // Optimized habit operations with better error handling
  const handleToggleHabit = useCallback(async (id: string) => {
    try {
      await toggleHabit(id, habits as Habit[]);
      refetchOptimized();
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit status", {
        description: "Please try again in a moment"
      });
    }
  }, [toggleHabit, habits, refetchOptimized]);
  
  const handleDeleteHabit = useCallback(async (id: string) => {
    try {
      await deleteHabit(id);
      refetchOptimized();
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit", {
        description: "Please try again in a moment"
      });
    }
  }, [deleteHabit, refetchOptimized]);
  
  const handleAddHabit = useCallback(async (habit: { title: string; description: string; category_id?: string }) => {
    try {
      await addHabit(habit);
      refetchOptimized();
      toast.success("Habit added successfully");
    } catch (error) {
      console.error("Error adding habit:", error);
      toast.error("Failed to add habit", {
        description: "Please try again in a moment"
      });
    }
  }, [addHabit, refetchOptimized]);
  
  // Pull-to-refresh functionality
  let touchStartY = 0;
  let pullDistance = 0;
  const PULL_THRESHOLD = 100;
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY = e.touches[0].clientY;
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === 0) return;
    const currentY = e.touches[0].clientY;
    pullDistance = currentY - touchStartY;
    
    if (pullDistance > 0 && pullDistance < PULL_THRESHOLD) {
      e.preventDefault();
      const element = e.currentTarget as HTMLDivElement;
      element.style.transform = `translateY(${pullDistance}px)`;
    }
  };
  
  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (pullDistance > PULL_THRESHOLD / 2) {
      setRefreshing(true);
      try {
        await refetchOptimized();
        toast.success("Habits refreshed", {
          duration: 2000
        });
      } catch (error) {
        toast.error("Failed to refresh habits");
      } finally {
        setRefreshing(false);
      }
    }
    
    const element = e.currentTarget as HTMLDivElement;
    element.style.transform = '';
    touchStartY = 0;
    pullDistance = 0;
  };
  
  const manualRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchOptimized();
      toast.success("Habits refreshed", {
        duration: 2000
      });
    } catch (error) {
      toast.error("Failed to refresh habits");
    } finally {
      setRefreshing(false);
    }
  };
  
  // Show loading state during initial load
  if (isInitialLoading) {
    return <HabitListLoading />;
  }
  
  // Show empty state if no habits are found and not loading
  if ((habits as Habit[]).length === 0 && !isLoading && !isError) {
    return <HabitListEmpty onAddHabit={handleAddHabit} />;
  }
  
  // Show error state
  if (isError && (habits as Habit[]).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Unable to load habits</h3>
        <p className="text-blue-100 mb-6">
          We encountered a problem loading your habits. This could be due to network issues.
        </p>
        <Button 
          onClick={manualRefresh} 
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </div>
    );
  }
  
  // Main content
  return (
    <div 
      className="w-full space-y-8 pb-6" 
      onTouchStart={isMobile ? handleTouchStart : undefined} 
      onTouchMove={isMobile ? handleTouchMove : undefined} 
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
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

      <div className="space-y-6">
        <HabitListContent 
          habits={habits as Habit[]} 
          onToggle={handleToggleHabit} 
          onDelete={handleDeleteHabit} 
          setHabitToDelete={setHabitToDelete} 
        />

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }} 
          className="mt-12 max-w-md mx-auto"
        >
          <AddHabitForm onAddHabit={handleAddHabit} />
        </motion.div>
      </div>
    </div>
  );
}
