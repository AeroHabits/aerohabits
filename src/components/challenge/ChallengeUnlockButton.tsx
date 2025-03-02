
import { Button } from "@/components/ui/button";
import { Lock, Coins } from "lucide-react";
import { toast } from "sonner";

interface ChallengeUnlockButtonProps {
  difficulty: "easy" | "medium" | "hard" | "master";
  userPoints: number;
  pointsRequired?: number;
  onUnlock?: () => void;
  isLoading?: boolean;
}

export function ChallengeUnlockButton({ 
  difficulty, 
  userPoints,
  pointsRequired = 1000,
  onUnlock,
  isLoading = false
}: ChallengeUnlockButtonProps) {
  const difficultyPointsMap = {
    easy: 0,
    medium: 1000,
    hard: 3000,
    master: 10000
  };
  
  const requiredPoints = pointsRequired || difficultyPointsMap[difficulty];
  const canUnlock = userPoints >= requiredPoints;

  const handleUnlockClick = () => {
    if (!canUnlock) {
      toast.error(`You need ${requiredPoints - userPoints} more points to unlock ${difficulty} challenges!`);
      return;
    }
    if (onUnlock) onUnlock();
  };

  return (
    <div className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-lg shadow-sm h-full flex items-center justify-center">
      <Button 
        className="w-full bg-purple-500 hover:bg-purple-600 transition-all duration-300"
        onClick={handleUnlockClick}
        disabled={!canUnlock || isLoading}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <Coins className="h-4 w-4" />
          <span>{requiredPoints} points to unlock {difficulty} challenges</span>
        </div>
      </Button>
    </div>
  );
}
