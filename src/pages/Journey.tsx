
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { StatsGrid } from "@/components/StatsGrid";
import { JourneyHero } from "@/components/journey/JourneyHero";
import { useJourneyStats } from "@/hooks/useJourneyStats";
import { motion } from "framer-motion";

const Journey = () => {
  const { stats } = useJourneyStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
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
