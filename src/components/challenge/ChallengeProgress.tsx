import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ChallengeCompletion } from "./ChallengeCompletion";
import { format } from "date-fns";

interface ChallengeProgressProps {
  daysCompleted: number;
  totalDays: number;
  startDate: string | null;
  userChallengeId: string;
  onProgressUpdate: () => void;
}

export function ChallengeProgress({
  daysCompleted,
  totalDays,
  startDate,
  userChallengeId,
  onProgressUpdate
}: ChallengeProgressProps) {
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    const checkTodayCompletion = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: completions } = await supabase
        .from('challenge_completions')
        .select('*')
        .eq('user_challenge_id', userChallengeId)
        .eq('completed_date', today)
        .single();

      setIsCompletedToday(!!completions);
    };

    if (userChallengeId) {
      checkTodayCompletion();
    }
  }, [userChallengeId]);

  const progress = (daysCompleted / totalDays) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress: {daysCompleted}/{totalDays} days</span>
        {startDate && (
          <span>Started: {new Date(startDate).toLocaleDateString()}</span>
        )}
      </div>
      <Progress value={progress} className="h-2" />
      <ChallengeCompletion
        userChallengeId={userChallengeId}
        onComplete={onProgressUpdate}
        isCompleted={isCompletedToday}
      />
    </div>
  );
}