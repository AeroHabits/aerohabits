import { WeeklyProgress } from "@/components/WeeklyProgress";
import { StatsGrid } from "@/components/StatsGrid";
import { JourneyHero } from "@/components/journey/JourneyHero";
import { useJourneyStats } from "@/hooks/useJourneyStats";
import { motion } from "framer-motion";

const Journey = () => {
  const { stats } = useJourneyStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-gradient-x">
      <div className="container py-12 space-y-12">
        <JourneyHero />

        <div className="space-y-8">
          <StatsGrid
            totalHabits={stats.totalHabits}
            currentStreak={stats.currentStreak}
            completionRate={stats.completionRate}
            weeklyProgress={stats.weeklyProgress}
            monthlyAverage={stats.monthlyAverage}
            bestStreak={stats.bestStreak}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WeeklyProgress />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Journey;