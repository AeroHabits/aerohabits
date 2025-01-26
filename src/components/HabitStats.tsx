import { Card } from "@/components/ui/card";
import { Trophy, Target, CheckCircle2 } from "lucide-react";

interface HabitStatsProps {
  totalHabits: number;
  totalStreaks: number;
  completedToday: number;
}

export function HabitStats({ totalHabits, totalStreaks, completedToday }: HabitStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4 bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30">
        <div className="flex items-center space-x-4">
          <Target className="h-6 w-6 text-white" />
          <div>
            <p className="text-sm font-medium text-white/70">Total Habits</p>
            <p className="text-2xl font-bold text-white">{totalHabits}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30">
        <div className="flex items-center space-x-4">
          <Trophy className="h-6 w-6 text-yellow-300" />
          <div>
            <p className="text-sm font-medium text-white/70">Total Streaks</p>
            <p className="text-2xl font-bold text-white">{totalStreaks}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30">
        <div className="flex items-center space-x-4">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <div>
            <p className="text-sm font-medium text-white/70">Completed Today</p>
            <p className="text-2xl font-bold text-white">{completedToday}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}