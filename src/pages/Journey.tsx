
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { StatsGrid } from "@/components/StatsGrid";
import { JourneyHero } from "@/components/journey/JourneyHero";
import { useJourneyStats } from "@/hooks/useJourneyStats";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";

const Journey = () => {
  const { stats } = useJourneyStats();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/50 to-black animated-bg">
      <div className={cn(
        "container mx-auto px-4 py-6 md:py-8",
        isMobile && "pb-24"
      )}>
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-white/20">
            <JourneyHero />
            <div className="mt-10 space-y-10">
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
}

export default Journey;
