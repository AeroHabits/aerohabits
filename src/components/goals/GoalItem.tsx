import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, CheckCircle, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
}

interface GoalItemProps {
  goal: Goal;
  onStatusUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItem({ goal, onStatusUpdate, onDelete }: GoalItemProps) {
  return (
    <Card className="p-6 bg-white/70 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStatusUpdate(goal.id)}
              className="hover:bg-transparent"
            >
              {goal.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </Button>
            <h3 className={cn(
              "font-semibold",
              goal.status === 'completed' && "line-through text-muted-foreground"
            )}>
              {goal.title}
            </h3>
          </div>
          {goal.description && (
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          )}
          {goal.target_date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              {format(new Date(goal.target_date), "PPP")}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(goal.id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}