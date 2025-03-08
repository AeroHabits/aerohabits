
import { Star, Trophy, Zap, Target } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  // Function to get fun icon based on streak
  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Trophy className="h-5 w-5 text-amber-400" />;
    if (streak >= 14) return <Zap className="h-5 w-5 text-indigo-400" />;
    if (streak >= 7) return <Star className="h-5 w-5 text-blue-400" />;
    return <Target className="h-5 w-5 text-purple-400" />;
  };

  return (
    <div className="flex items-center space-x-1 text-purple-300 bg-purple-400/10 px-2 py-1 rounded-full">
      {getStreakIcon(streak)}
      <span className="font-medium text-white/90 text-sm">{streak} day streak!</span>
    </div>
  );
}
