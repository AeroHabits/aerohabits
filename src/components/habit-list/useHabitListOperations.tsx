
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useHabitOperations } from "@/hooks/useHabitOperations";
import { useOptimizedDataFetching } from "@/hooks/useOptimizedDataFetching";
import { supabase } from "@/integrations/supabase/client";
import { Habit } from "@/types";

export function useHabitListOperations() {
  const { deleteHabit, toggleHabit, addHabit, isOnline, pendingToggles } = useHabitOperations();
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
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
      
      setTimeout(() => {
        refetchOptimized();
      }, 1000);
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

  return {
    habits,
    isLoading,
    isError,
    isFetching,
    refreshing,
    setRefreshing,
    networkQuality,
    isOnline,
    pendingToggles,
    profile,
    habitToDelete,
    setHabitToDelete,
    handleToggleHabit,
    handleDeleteHabit,
    handleAddHabit,
    manualRefresh,
    refetchOptimized,
    isInitialLoading
  };
}
