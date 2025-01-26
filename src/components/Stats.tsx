import { Card } from "@/components/ui/card";
import { Trophy, Flame, Target } from "lucide-react";

export function Stats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 flex items-center space-x-4 bg-white/70 backdrop-blur-sm border-violet-200/50 hover:border-violet-300/60">
        <Trophy className="h-10 w-10 text-amber-500" />
        <div>
          <h3 className="font-semibold">Total Habits</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
      </Card>
      <Card className="p-6 flex items-center space-x-4 bg-white/70 backdrop-blur-sm border-violet-200/50 hover:border-violet-300/60">
        <Flame className="h-10 w-10 text-rose-500" />
        <div>
          <h3 className="font-semibold">Current Streak</h3>
          <p className="text-2xl font-bold">7 days</p>
        </div>
      </Card>
      <Card className="p-6 flex items-center space-x-4 bg-white/70 backdrop-blur-sm border-violet-200/50 hover:border-violet-300/60">
        <Target className="h-10 w-10 text-violet-600" />
        <div>
          <h3 className="font-semibold">Completion Rate</h3>
          <p className="text-2xl font-bold">85%</p>
        </div>
      </Card>
    </div>
  );
}