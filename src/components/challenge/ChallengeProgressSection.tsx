
import { ChallengeProgress } from "./ChallengeProgress";
import { ChallengePointsMessage } from "./ChallengePointsMessage";
import { ChallengeResetButton } from "./ChallengeResetButton";
import { ChallengeStreakMilestone } from "./ChallengeStreakMilestone";

interface ChallengeProgressSectionProps {
  daysCompleted: number;
  totalDays: number;
  startDate: string | null;
  userChallengeId: string;
  challengeId: string;
  onProgressUpdate: () => void;
  rewardPoints: number | null;
  isCompleted?: boolean;
  totalCompletions?: number;
}

export function ChallengeProgressSection({
  daysCompleted,
  totalDays,
  startDate,
  userChallengeId,
  challengeId,
  onProgressUpdate,
  rewardPoints,
  isCompleted = false,
  totalCompletions = 0
}: ChallengeProgressSectionProps) {
  return (
    <div className="space-y-4">
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
      <ChallengeResetButton
        userChallengeId={userChallengeId}
        challengeId={challengeId}
        isCompleted={isCompleted}
        onReset={onProgressUpdate}
        totalCompletions={totalCompletions}
      />
      <ChallengeStreakMilestone completionCount={totalCompletions} />
    </div>
  );
}
