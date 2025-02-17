
import { ChallengeCard } from "../ChallengeCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
  return (
    <div className="space-y-6">
      {!canAccessDifficulty && (
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Complete 80% of the challenges in your current difficulty level to unlock the next set of challenges. Keep pushing forward! 💪
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {challenges?.map((challenge) => {
          // Only lock challenges that come after the current one
          const currentChallenge = challenges.find(c => c.id === currentChallengeId);
          const isLocked = currentChallengeId !== null && 
                          currentChallenge && 
                          challenge.sequence_order > currentChallenge.sequence_order;

          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={(challengeId) => onJoinChallenge(challengeId)}
              isJoined={userChallenges?.includes(challenge.id)}
              userPoints={userPoints}
              canAccessDifficulty={canAccessDifficulty}
              isLocked={isLocked}
              sequenceOrder={challenge.sequence_order}
            />
          );
        })}
      </div>
    </div>
  );
}
