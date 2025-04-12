
import { useDeleteHabit } from "./habits/useDeleteHabit";
import { useAddHabit } from "./habits/useAddHabit";
import { useToggleHabit } from "./habits/useToggleHabit";

/**
 * Primary hook for habit operations that combines all the habit-related operations
 * into a single interface for ease of use throughout the application.
 */
export function useHabitOperations() {
  const deleteHabit = useDeleteHabit();
  const addHabit = useAddHabit();
  const toggleHabit = useToggleHabit();

  return {
    deleteHabit,
    toggleHabit,
    addHabit,
  };
}
