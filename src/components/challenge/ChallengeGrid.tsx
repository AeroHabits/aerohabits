
import { motion } from "framer-motion";
import { ChallengeCard } from "@/components/ChallengeCard";
import { ChallengeUnlockButton } from "./ChallengeUnlockButton";
import { Challenge } from "@/types";

interface ChallengeGridProps {
  challenges: Challenge[];
  userChallenges: string[];
  onJoinChallenge: (challengeId: string) => void;
  userPoints: number;
  canAccessDifficulty?: boolean;
  currentChallengeId: string | null;
}

export function ChallengeGrid({ 
  challenges, 
  userChallenges, 
  onJoinChallenge,
  userPoints,
  canAccessDifficulty = true,
  currentChallengeId
}: ChallengeGridProps) {
  if (challenges.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-gray-400">No challenges found for this difficulty level.</p>
      </div>
    );
  }

  return (
    <div className="challenge-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge, index) => {
        const isJoined = userChallenges.includes(challenge.id);
        const isLocked = !canAccessDifficulty;
        
        return (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {isLocked ? (
              <ChallengeUnlockButton 
                difficulty={challenge.difficulty}
                userPoints={userPoints}
              />
            ) : (
              <ChallengeCard
                challenge={challenge}
                onJoin={onJoinChallenge}
                isJoined={isJoined}
                userPoints={userPoints}
                canAccessDifficulty={canAccessDifficulty}
                isLocked={false}
                sequenceOrder={challenge.sequence_order || index + 1}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
