import { ChallengeProgress } from "./ChallengeProgress";
import { ChallengePointsMessage } from "./ChallengePointsMessage";

interface ChallengeProgressSectionProps {
  daysCompleted: number;
  totalDays: number;
  startDate: string | null;
  userChallengeId: string;
  onProgressUpdate: () => void;
  rewardPoints: number | null;
}

export function ChallengeProgressSection({
  daysCompleted,
  totalDays,
  startDate,
  userChallengeId,
  onProgressUpdate,
  rewardPoints
}: ChallengeProgressSectionProps) {
  return (
    <>
      <ChallengeProgress
        daysCompleted={daysCompleted}
        totalDays={totalDays}
        startDate={startDate}
        userChallengeId={userChallengeId}
        onProgressUpdate={onProgressUpdate}
      />
      <ChallengePointsMessage
        rewardPoints={rewardPoints}
        daysCompleted={daysCompleted}
        totalDays={totalDays}
      />
    </>
  );
}