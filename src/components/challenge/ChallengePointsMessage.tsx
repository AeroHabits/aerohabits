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
      <p className="text-sm font-medium text-primary">
        You've earned {rewardPoints} points for completing this challenge!
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-primary">
      Complete all {totalDays} days to earn {rewardPoints} points!
    </p>
  );
}