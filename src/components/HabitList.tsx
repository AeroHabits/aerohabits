
import { AddHabitForm } from "./AddHabitForm";
import { HabitListEmpty } from "./HabitListEmpty";
import { HabitListLoading } from "./HabitListLoading";
import { HabitListContent } from "./HabitListContent";
import { useHabits } from "@/hooks/useHabits";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  } = useHabits();

  const isMobile = useIsMobile();
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
      await refetch();
    }

    const element = e.currentTarget as HTMLDivElement;
    element.style.transform = '';
    touchStartY = 0;
    pullDistance = 0;
  };

  if (isLoading) {
    return <HabitListLoading />;
  }

  if (habits.length === 0) {
    return <HabitListEmpty onAddHabit={addHabit} />;
  }

  return (
    <div 
      className="space-y-8 relative"
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <AnimatePresence>
        {isFetching && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Refreshing...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HabitListContent
        habits={habits}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
        setHabitToDelete={setHabitToDelete}
      />
      <div className="max-w-md mx-auto">
        <AddHabitForm onAddHabit={addHabit} />
      </div>
    </div>
  );
}
