
import { motion } from "framer-motion";
import { AddHabitForm } from "../AddHabitForm";
import { HabitListEmpty } from "../HabitListEmpty";
import { HabitListLoading } from "../HabitListLoading";
import { HabitListContent } from "../HabitListContent";
import { PullToRefresh } from "./PullToRefresh";
import { NetworkStatusIndicator } from "./NetworkStatusIndicator";
import { HabitListError } from "./HabitListError";
import { useHabitListOperations } from "./useHabitListOperations";
import { Habit } from "@/types";

export function HabitListContainer() {
  const {
    habits,
    isLoading,
    isError,
    isFetching,
    refreshing,
    networkQuality,
    isOnline,
    pendingToggles,
    habitToDelete,
    setHabitToDelete,
    handleToggleHabit,
    handleDeleteHabit,
    handleAddHabit,
    manualRefresh,
    isInitialLoading
  } = useHabitListOperations();
  
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
    return <HabitListError onRefresh={manualRefresh} refreshing={refreshing} />;
  }
  
  // Main content
  return (
    <div className="w-full space-y-8 pb-6">
      <NetworkStatusIndicator 
        isOnline={isOnline}
        networkQuality={networkQuality}
        refreshing={refreshing}
        isFetching={isFetching}
      />

      <PullToRefresh onRefresh={manualRefresh}>
        <div className="space-y-6">
          <HabitListContent 
            habits={habits as Habit[]} 
            onToggle={handleToggleHabit} 
            onDelete={handleDeleteHabit} 
            setHabitToDelete={setHabitToDelete}
            pendingToggles={pendingToggles}
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
      </PullToRefresh>
    </div>
  );
}
