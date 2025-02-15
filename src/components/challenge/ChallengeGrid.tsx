
import { ChallengeCard } from "../ChallengeCard";

interface ChallengeGridProps {
  challenges: any[];
  userChallenges: string[];
  onJoinChallenge: (challengeId: string) => void;
  userPoints: number;
  canAccessAdvancedChallenge?: boolean;
  currentChallengeId: string | null;
}

export function ChallengeGrid({ 
  challenges, 
  userChallenges, 
  onJoinChallenge,
  userPoints,
  canAccessAdvancedChallenge = true,
  currentChallengeId
}: ChallengeGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {challenges?.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onJoin={(challengeId) => onJoinChallenge(challengeId)}
          isJoined={userChallenges?.includes(challenge.id)}
          userPoints={userPoints}
          canAccessAdvancedChallenge={canAccessAdvancedChallenge}
          isLocked={currentChallengeId !== null && currentChallengeId !== challenge.id}
          sequenceOrder={challenge.sequence_order}
        />
      ))}
    </div>
  );
}
