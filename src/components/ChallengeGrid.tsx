import { ChallengeCard } from "../ChallengeCard";

interface ChallengeGridProps {
  challenges: any[];
  userChallenges: string[];
  onJoinChallenge: (challengeId: string) => void;
}

export function ChallengeGrid({ challenges, userChallenges, onJoinChallenge }: ChallengeGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {challenges?.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onJoin={(challengeId) => onJoinChallenge(challengeId)}
          isJoined={userChallenges?.includes(challenge.id)}
        />
      ))}
    </div>
  );
}