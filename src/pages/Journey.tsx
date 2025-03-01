
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { StatsGrid } from "@/components/StatsGrid";
import { JourneyHero } from "@/components/journey/JourneyHero";
import { useJourneyStats } from "@/hooks/useJourneyStats";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/UserMenu";
import { GradientBackground } from "@/components/premium/GradientBackground";

const Journey = () => {
  const { stats } = useJourneyStats();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium gradient background */}
      <GradientBackground />
      
      <div className={cn(
        "container mx-auto px-4 py-6 md:py-8 relative z-10",
        isMobile && "pb-24"
      )}>
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-lg"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              AEROHABITS
            </span>
          </motion.h2>
          <UserMenu />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-gradient-to-br from-slate-900/80 via-indigo-900/40 to-slate-900/80 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-indigo-500/20">
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
