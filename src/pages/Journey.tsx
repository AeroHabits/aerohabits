
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Enhanced backdrop elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "container mx-auto px-4 pt-12 pb-6 md:py-8 space-y-8 md:space-y-12 safe-top relative z-10",
          isMobile && "pb-20"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-slate-950/80 backdrop-blur-xl rounded-3xl" />
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.05] shadow-2xl">
            <JourneyHero />
            <div className="mt-10 space-y-10 p-8">
              <StatsGrid
                totalHabits={stats.totalHabits}
                currentStreak={stats.currentStreak}
                completionRate={stats.completionRate}
                weeklyProgress={stats.weeklyProgress}
                monthlyAverage={stats.monthlyAverage}
                bestStreak={stats.bestStreak}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Journey;
