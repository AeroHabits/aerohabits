import { AddHabitForm } from "./AddHabitForm";
import { HabitListEmpty } from "./HabitListEmpty";
import { HabitListLoading } from "./HabitListLoading";
import { HabitListContent } from "./HabitListContent";
import { useHabits } from "@/hooks/useHabits";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, WifiOff, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";

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
  
  const {
    data: profile
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      const {
        data
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
    }
  });

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

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <HabitListLoading />;
  }
  
  if (habits.length === 0) {
    return <HabitListEmpty onAddHabit={addHabit} />;
  }
  
  return <div className="w-full space-y-8 pb-6" onTouchStart={isMobile ? handleTouchStart : undefined} onTouchMove={isMobile ? handleTouchMove : undefined} onTouchEnd={isMobile ? handleTouchEnd : undefined}>
      <AnimatePresence>
        {!isOnline && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Offline Mode</span>
            </div>
          </motion.div>}
        {isFetching && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-[#9b87f5] text-white px-4 py-2 rounded-full shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Refreshing...</span>
            </div>
          </motion.div>}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleRefresh}
            size="sm"
            variant="outline"
            className="bg-[#2A2F3C] border-[#403E43] hover:bg-[#9b87f5]/20 hover:border-[#9b87f5]/50 text-[#C8C8C9]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <HabitListContent habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} setHabitToDelete={setHabitToDelete} />

        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3
      }} className="mt-12 max-w-md mx-auto">
          <AddHabitForm onAddHabit={addHabit} />
        </motion.div>
      </div>
    </div>;
}
