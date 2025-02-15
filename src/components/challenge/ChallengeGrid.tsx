
import { ChallengeCard } from "../ChallengeCard";

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
  );
}
