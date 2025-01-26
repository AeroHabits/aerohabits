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
      <Card className="p-4 bg-white/95 backdrop-blur-sm border border-blue-100 hover:border-blue-200 shadow-md">
        <div className="flex items-center space-x-4">
          <Target className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Habits</p>
            <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-white/95 backdrop-blur-sm border border-blue-100 hover:border-blue-200 shadow-md">
        <div className="flex items-center space-x-4">
          <Trophy className="h-6 w-6 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Streaks</p>
            <p className="text-2xl font-bold text-gray-900">{totalStreaks}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-white/95 backdrop-blur-sm border border-blue-100 hover:border-blue-200 shadow-md">
        <div className="flex items-center space-x-4">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-600">Completed Today</p>
            <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}