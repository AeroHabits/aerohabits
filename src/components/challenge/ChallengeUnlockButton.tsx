import { Button } from "@/components/ui/button";
import { Lock, Coins } from "lucide-react";
import { toast } from "sonner";

interface ChallengeUnlockButtonProps {
  pointsRequired: number;
  userPoints: number;
  onUnlock: () => void;
  isLoading: boolean;
}

export function ChallengeUnlockButton({ 
  pointsRequired, 
  userPoints, 
  onUnlock,
  isLoading 
}: ChallengeUnlockButtonProps) {
  const canUnlock = userPoints >= pointsRequired;

  const handleUnlockClick = () => {
    if (!canUnlock) {
      toast.error(`You need ${pointsRequired - userPoints} more points to unlock this challenge!`);
      return;
    }
    onUnlock();
  };

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