
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Lock } from "lucide-react";
import { toast } from "sonner";

interface ChallengeActionsProps {
  isJoined: boolean | undefined;
  isLoading: boolean;
  onJoin: () => void;
  difficulty: string;
  userPoints: number;
  canAccessDifficulty?: boolean;
  isLocked?: boolean;
}

export function ChallengeActions({ 
  isJoined, 
  isLoading, 
  onJoin,
  difficulty,
  canAccessDifficulty = true,
  isLocked = false
}: ChallengeActionsProps) {
  const handleLockedClick = () => {
    if (isLocked && !isJoined) {
      toast.info(
        "Complete Current Challenge First!", 
        {
          description: "Focus on your active challenge. You'll unlock this one once you complete it.",
          duration: 4000
        }
      );
      return;
    }
  };

  const handleDifficultyClick = () => {
    if (!canAccessDifficulty) {
      toast.info(
        "Level Up Required!", 
        {
          description: "Complete 80% of challenges in your current difficulty to unlock this level. Keep pushing forward!",
          duration: 4000
        }
      );
      return;
    }
  };

  if (isLocked && !isJoined) {
    return (
      <Button 
        className="w-full bg-gray-500 hover:bg-gray-600 cursor-not-allowed px-2 py-1.5 h-auto min-h-[44px] text-xs sm:text-sm whitespace-normal"
        onClick={handleLockedClick}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>Complete Previous Challenge to Unlock</span>
        </div>
      </Button>
    );
  }

  if (!canAccessDifficulty) {
    return (
      <Button 
        className="w-full bg-gray-500 hover:bg-gray-600 cursor-not-allowed px-2 py-1.5 h-auto min-h-[44px] text-xs sm:text-sm whitespace-normal"
        onClick={handleDifficultyClick}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>Complete 80% of Previous Difficulty to Unlock</span>
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
