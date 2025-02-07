import { ChallengeMotivation } from "./ChallengeMotivation";
import { ChallengeCompletionCriteria } from "./ChallengeCompletionCriteria";
import { ChallengeTips } from "./ChallengeTips";

interface ChallengeContentProps {
  description: string | null;
  motivationText: string | null;
  completionCriteria: string | null;
  tips: string[] | null;
  isHovered: boolean;
}

export function ChallengeContent({
  description,
  motivationText,
  completionCriteria,
  tips,
  isHovered
}: ChallengeContentProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>
      
      <ChallengeMotivation 
        motivationText={motivationText}
        isHovered={isHovered}
      />

      <ChallengeCompletionCriteria 
        criteria={completionCriteria}
      />

      {tips && isHovered && (
        <ChallengeTips tips={tips} isHovered={isHovered} />
      )}
    </div>
  );
}