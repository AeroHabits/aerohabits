import { Card } from "@/components/ui/card";
import { ListChecks, Activity, CheckCircle } from "lucide-react";

interface HabitStatsProps {
  totalHabits: number;
  totalStreaks: number;
  completedToday: number;
}

export function HabitStats({ totalHabits, totalStreaks, completedToday }: HabitStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <ListChecks className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Habits</p>
            <h3 className="text-2xl font-bold">{totalHabits}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Activity className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Streaks</p>
            <h3 className="text-2xl font-bold">{totalStreaks}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <CheckCircle className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
            <h3 className="text-2xl font-bold">{completedToday}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
}