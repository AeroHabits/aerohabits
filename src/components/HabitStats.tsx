import { Trophy, Target } from "lucide-react";

interface HabitStatsProps {
  totalHabits: number;
  totalStreaks: number;
}

export function HabitStats({ totalHabits, totalStreaks }: HabitStatsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-[#D3E4FD]/50 hover:border-[#9b87f5]/60 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#7E69AB]">Total Habits</h3>
          <p className="text-3xl font-bold text-[#6E59A5]">{totalHabits}</p>
        </div>
        <Target className="h-12 w-12 text-[#8B5CF6] opacity-75" />
      </div>
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-[#D3E4FD]/50 hover:border-[#9b87f5]/60 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#7E69AB]">Total Streaks</h3>
          <p className="text-3xl font-bold text-[#6E59A5]">{totalStreaks}</p>
        </div>
        <Trophy className="h-12 w-12 text-[#8B5CF6] opacity-75" />
      </div>
    </section>
  );
}