
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flame } from "lucide-react";

interface ChallengeActionsProps {
  isPremium: boolean | null;
  isJoined: boolean | undefined;
  isLoading: boolean;
  onJoin: () => void;
  difficulty: string;
  userPoints: number;
}

export function ChallengeActions({ 
  isJoined, 
  isLoading, 
  onJoin,
}: ChallengeActionsProps) {
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
