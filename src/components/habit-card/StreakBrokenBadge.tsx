
import { AlertCircle } from "lucide-react";

interface StreakBrokenBadgeProps {
  isVisible: boolean;
}

export function StreakBrokenBadge({ isVisible }: StreakBrokenBadgeProps) {
  if (!isVisible) return null;

  return (
    <div className="flex items-center space-x-1 text-yellow-300 bg-yellow-400/10 px-2 py-1 rounded-full">
      <AlertCircle className="h-4 w-4" />
      <span className="font-medium text-white/90 text-sm">Start again!</span>
    </div>
  );
}
