
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { StatsGrid } from "@/components/StatsGrid";
import { JourneyHero } from "@/components/journey/JourneyHero";
import { useJourneyStats } from "@/hooks/useJourneyStats";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/layout/AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Journey = () => {
  const { stats } = useJourneyStats();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className={cn(
        "container py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isMobile && "pb-24"
      )}>
        <AppHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
            <JourneyHero />
            <div className="space-y-8 mt-8">
              <StatsGrid
                totalHabits={stats.totalHabits}
                currentStreak={stats.currentStreak}
                completionRate={stats.completionRate}
                weeklyProgress={stats.weeklyProgress}
                monthlyAverage={stats.monthlyAverage}
                bestStreak={stats.bestStreak}
              />
              <WeeklyProgress />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Journey;
