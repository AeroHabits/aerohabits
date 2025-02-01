import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Flame } from "lucide-react";

interface ChallengeActionsProps {
  isPremium: boolean | null;
  isJoined: boolean | undefined;
  isLoading: boolean;
  onJoin: () => void;
}

export function ChallengeActions({ isPremium, isJoined, isLoading, onJoin }: ChallengeActionsProps) {
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
      variant={isPremium ? "secondary" : "default"}
    >
      {isPremium ? (
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Premium Challenge</span>
        </div>
      ) : isJoined ? (
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