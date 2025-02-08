
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Lock } from "lucide-react";
import { ChallengeUnlockButton } from "./ChallengeUnlockButton";

interface ChallengeActionsProps {
  isPremium: boolean | null;
  isJoined: boolean | undefined;
  isLoading: boolean;
  onJoin: () => void;
  difficulty: string;
  userPoints: number;
  canAccessAdvancedChallenge?: boolean;
}

export function ChallengeActions({ 
  isJoined, 
  isLoading, 
  onJoin,
  difficulty,
  canAccessAdvancedChallenge = true
}: ChallengeActionsProps) {
  const isAdvancedChallenge = ['hard', 'master'].includes(difficulty.toLowerCase());
  const isLocked = isAdvancedChallenge && !canAccessAdvancedChallenge;

  if (isLocked) {
    return (
      <Button 
        className="w-full bg-gray-500 hover:bg-gray-600 cursor-not-allowed px-2 py-1.5 h-auto min-h-[44px] text-xs sm:text-sm whitespace-normal"
        disabled={true}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>Complete 80% of Medium Challenges to Unlock</span>
        </div>
      </Button>
    );
  }

  return (
    <Button 
      className={`w-full transition-all duration-300 ${
        isJoined 
          ? 'bg-green-500 hover:bg-green-600' 
          : ''
      }`}
      onClick={onJoin}
      disabled={isLoading || isJoined}
    >
      {isJoined ? (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Challenge Accepted!</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4" />
          <span>Accept Challenge</span>
        </div>
      )}
    </Button>
  );
}
