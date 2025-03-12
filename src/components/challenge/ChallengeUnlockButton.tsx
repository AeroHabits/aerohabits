
import { Button } from "@/components/ui/button";
import { Lock, Coins } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  const pointsNeeded = pointsRequired - userPoints;

  const handleUnlockClick = () => {
    if (!canUnlock) {
      toast.error(`You need ${pointsNeeded} more points to unlock this challenge!`);
      return;
    }
    onUnlock();
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button 
        className={`w-full transition-all duration-300 ${
          canUnlock 
            ? "bg-purple-500 hover:bg-purple-600" 
            : "bg-gray-500 hover:bg-gray-600"
        }`}
        onClick={handleUnlockClick}
        disabled={!canUnlock || isLoading}
        aria-disabled={!canUnlock || isLoading}
        aria-label={canUnlock 
          ? `Unlock challenge for ${pointsRequired} points` 
          : `Need ${pointsNeeded} more points to unlock`
        }
        role="button"
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" aria-hidden="true" />
          <Coins className="h-4 w-4" aria-hidden="true" />
          <span>
            {canUnlock 
              ? `Unlock for ${pointsRequired} points` 
              : `${pointsRequired} points to unlock`
            }
          </span>
        </div>
      </Button>
      {!canUnlock && (
        <p className="text-xs text-gray-400 mt-1 text-center">
          You need {pointsNeeded} more points
        </p>
      )}
    </motion.div>
  );
}
