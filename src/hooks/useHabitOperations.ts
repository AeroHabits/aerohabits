
import { useHabitDelete } from "./useHabitDelete";
import { useHabitToggle } from "./useHabitToggle";
import { useHabitAdd } from "./useHabitAdd";
import { useOfflineSync } from "./useOfflineSync";
import { useMemo } from "react";

export function useHabitOperations() {
  const { deleteHabit } = useHabitDelete();
  const { toggleHabit, pendingToggles } = useHabitToggle();
  const { addHabit } = useHabitAdd();
  const { isOnline } = useOfflineSync();

  // Use memoization to prevent unnecessary re-renders
  const operationsAPI = useMemo(() => ({
    deleteHabit,
    toggleHabit,
    addHabit,
    isOnline,
    pendingToggles
  }), [deleteHabit, toggleHabit, addHabit, isOnline, pendingToggles]);

  return operationsAPI;
}
