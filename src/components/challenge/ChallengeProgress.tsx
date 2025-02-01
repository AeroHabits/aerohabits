import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";

interface ChallengeProgressProps {
  daysCompleted: number;
  totalDays: number;
  startDate: string | null;
}

export function ChallengeProgress({ daysCompleted, totalDays, startDate }: ChallengeProgressProps) {
  if (!startDate) return null;

  const progressValue = (daysCompleted / totalDays) * 100;
  const daysRemaining = totalDays - daysCompleted;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Day {daysCompleted} of {totalDays}
        </span>
        <span>{Math.round(progressValue)}% Complete</span>
      </div>
      <Progress value={progressValue} className="h-2" />
      {daysRemaining > 0 ? (
        <p className="text-sm text-blue-600">
          {daysRemaining} days remaining to complete this challenge!
        </p>
      ) : (
        <p className="text-sm text-green-600 font-medium">
          Challenge completed! 🎉
        </p>
      )}
    </div>
  );
}