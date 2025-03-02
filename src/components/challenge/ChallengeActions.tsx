
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame, Lock, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    if (difficulty === 'master') {
      toast.info(
        "Master Challenges Locked!", 
        {
          description: "Complete 10 challenges of any difficulty to unlock Master level challenges. Keep pushing forward!",
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

  if (difficulty === 'master' && !canAccessDifficulty) {
    return (
      <Button 
        className="w-full bg-gray-500 hover:bg-gray-600 cursor-not-allowed px-2 py-1.5 h-auto min-h-[44px] text-xs sm:text-sm whitespace-normal"
        onClick={handleDifficultyClick}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>Complete 10 Challenges to Unlock Master Level</span>
        </div>
      </Button>
    );
  }

  return (
    <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button 
        variant={isJoined ? "premium" : "default"}
        className={`w-full transition-all duration-300 ${
          isJoined 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-green-400/20' 
            : ''
        }`}
        onClick={onJoin}
        disabled={isLoading || isJoined}
      >
        {isJoined ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Challenge Accepted!</span>
            <Star className="h-3 w-3 text-yellow-300" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Accept Challenge</span>
          </div>
        )}
      </Button>
    </motion.div>
  );
}
