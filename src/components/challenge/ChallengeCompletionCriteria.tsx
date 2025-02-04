import { CheckCircle2 } from "lucide-react";

interface ChallengeCompletionCriteriaProps {
  criteria: string | null;
}

export function ChallengeCompletionCriteria({ criteria }: ChallengeCompletionCriteriaProps) {
  if (!criteria) return null;

  return (
    <div className="flex items-start gap-2 text-xs">
      <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
      <span className="line-clamp-2">{criteria}</span>
    </div>
  );
}