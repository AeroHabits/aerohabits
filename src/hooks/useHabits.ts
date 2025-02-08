
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useHabitOperations } from "./useHabitOperations";
import { useOfflineSync } from "./useOfflineSync";
import { useLocalStorage } from "./useLocalStorage";

export function useHabits() {
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { deleteHabit, toggleHabit, addHabit } = useHabitOperations();
  const { debouncedSync, isOnline } = useOfflineSync();
  const { loadOfflineHabits, saveOfflineHabits } = useLocalStorage();

  const { data: habits = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      if (!isOnline) {
        return loadOfflineHabits();
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: habitsData, error: habitsError } = await supabase
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

      if (habitsError) throw habitsError;
      
      saveOfflineHabits(habitsData || []);
      return habitsData || [];
    },
  });

  // Try to sync when coming back online
  useState(() => {
    if (isOnline) {
      debouncedSync();
    }
  });

  return {
    habits,
    isLoading,
    error,
    habitToDelete,
    setHabitToDelete,
    deleteHabit: (id: string) => deleteHabit(id).then(() => refetch()),
    toggleHabit: (id: string) => toggleHabit(id, habits).then(() => refetch()),
    addHabit: (habit: { title: string; description: string; category_id?: string }) => 
      addHabit(habit).then(() => refetch()),
    refetch,
    isFetching,
    isOnline,
  };
}
