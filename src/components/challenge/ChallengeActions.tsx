import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Flame, Coins } from "lucide-react";
import { toast } from "sonner";

interface ChallengeActionsProps {
  isPremium: boolean | null;
  isJoined: boolean | undefined;
  isLoading: boolean;
  onJoin: () => void;
  difficulty: string;
  userPoints: number;
  onUnlock: () => void;
  isUnlocked: boolean;
}

export function ChallengeActions({ 
  isPremium, 
  isJoined, 
  isLoading, 
  onJoin, 
  difficulty,
  userPoints,
  onUnlock,
  isUnlocked
}: ChallengeActionsProps) {
  const getPointsRequired = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'medium':
        return 1000;
      case 'hard':
        return 1500;
      case 'master':
        return 4000;
      default:
        return 0;
    }
  };

  const pointsRequired = getPointsRequired(difficulty);
  const canUnlock = userPoints >= pointsRequired;

  const handleUnlockClick = () => {
    if (!canUnlock) {
      toast.error(`You need ${pointsRequired - userPoints} more points to unlock this challenge!`);
      return;
    }
    onUnlock();
  };

  if (isPremium && !isUnlocked) {
    return (
      <Button 
        className="w-full bg-purple-500 hover:bg-purple-600 transition-all duration-300"
        onClick={handleUnlockClick}
        disabled={!canUnlock || isLoading}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <Coins className="h-4 w-4" />
          <span>{pointsRequired} points to unlock</span>
        </div>
      </Button>
    );
  }

  return (
    <Button 
      className={`w-full transition-all duration-300 ${
        isJoined 
          ? 'bg-green-500 hover:bg-green-600' 
          : isPremium 
            ? 'bg-purple-500 hover:bg-purple-600' 
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