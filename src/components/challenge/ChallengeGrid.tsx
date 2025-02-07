
import { ChallengeCard } from "../ChallengeCard";

interface ChallengeGridProps {
  challenges: any[];
  userChallenges: string[];
  onJoinChallenge: (challengeId: string) => void;
  userPoints: number;
}

export function ChallengeGrid({ 
  challenges, 
  userChallenges, 
  onJoinChallenge,
  userPoints 
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
        />
      ))}
    </div>
  );
}
