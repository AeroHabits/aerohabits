
import { useHabitDelete } from "./useHabitDelete";
import { useHabitToggle } from "./useHabitToggle";
import { useHabitAdd } from "./useHabitAdd";
import { useOfflineSync } from "./useOfflineSync";

export function useHabitOperations() {
  const { deleteHabit } = useHabitDelete();
  const { toggleHabit, pendingToggles } = useHabitToggle();
  const { addHabit } = useHabitAdd();
  const { isOnline } = useOfflineSync();

  return {
    deleteHabit,
    toggleHabit,
    addHabit,
    isOnline,
    pendingToggles
  };
}
