
import { ChallengeCard } from "../ChallengeCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface ChallengeGridProps {
  challenges: any[];
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
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-8">
      {!canAccessDifficulty && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="bg-gradient-to-r from-blue-900/20 to-blue-700/20 border-blue-600/30 backdrop-blur-sm">
            <Info className="h-5 w-5 text-blue-400" />
            <AlertDescription className="text-blue-100 text-sm font-medium">
              Complete 80% of the challenges in your current difficulty level to unlock the next set of challenges. 
              <span className="font-semibold ml-1">Keep pushing forward! 💪</span>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {challenges?.map((challenge, index) => {
          // Only lock challenges that come after the current one
          const currentChallenge = challenges.find(c => c.id === currentChallengeId);
          const isLocked = currentChallengeId !== null && 
                          currentChallenge && 
                          challenge.sequence_order > currentChallenge.sequence_order;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={isMobile ? 'touch-manipulation transform-gpu' : ''}
            >
              <ChallengeCard
                challenge={challenge}
                onJoin={(challengeId) => onJoinChallenge(challengeId)}
                isJoined={userChallenges?.includes(challenge.id)}
                userPoints={userPoints}
                canAccessDifficulty={canAccessDifficulty}
                isLocked={isLocked}
                sequenceOrder={challenge.sequence_order}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
