
import { motion } from "framer-motion";

interface ChallengePointsMessageProps {
  rewardPoints: number | null;
  daysCompleted: number;
  totalDays: number;
}

export function ChallengePointsMessage({ 
  rewardPoints, 
  daysCompleted, 
  totalDays 
}: ChallengePointsMessageProps) {
  if (!rewardPoints) return null;

  if (daysCompleted === totalDays) {
    return (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm font-medium text-emerald-400 flex items-center gap-1 mt-1"
      >
        <span className="text-xs bg-emerald-400/20 p-1 rounded-md text-emerald-300">
          +{rewardPoints} points earned
        </span>
      </motion.p>
    );
  }

  return (
    <p className="text-sm font-medium text-primary/80 mt-1">
      Complete all {totalDays} days to earn {rewardPoints} points
    </p>
  );
}
