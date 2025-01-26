import { Trophy, Target } from "lucide-react";

interface HabitStatsProps {
  totalHabits: number;
  totalStreaks: number;
}

export function HabitStats({ totalHabits, totalStreaks }: HabitStatsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20 hover:border-white/30 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Total Habits</h3>
          <p className="text-3xl font-bold text-white">{totalHabits}</p>
        </div>
        <Target className="h-12 w-12 text-white opacity-75" />
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20 hover:border-white/30 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Total Streaks</h3>
          <p className="text-3xl font-bold text-white">{totalStreaks}</p>
        </div>
        <Trophy className="h-12 w-12 text-yellow-300 opacity-75" />
      </div>
    </section>
  );
}