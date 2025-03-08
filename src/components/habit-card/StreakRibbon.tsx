
import { cn } from "@/lib/utils";

interface StreakRibbonProps {
  streak: number;
}

export function StreakRibbon({ streak }: StreakRibbonProps) {
  if (streak < 7) return null;

  return (
    <div className={cn(
      "absolute -right-12 top-6 text-white px-12 py-1 rotate-45 transform text-sm font-semibold shadow-lg",
      streak >= 30 ? "bg-gradient-to-r from-amber-500 to-yellow-500" :
      streak >= 14 ? "bg-gradient-to-r from-indigo-500 to-blue-500" :
      "bg-gradient-to-r from-purple-500 to-indigo-500"
    )}>
      {streak >= 30 ? "Master!" : streak >= 14 ? "Expert!" : "Champion!"}
    </div>
  );
}
