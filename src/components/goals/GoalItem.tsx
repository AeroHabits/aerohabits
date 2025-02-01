import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2, CheckCircle, Circle, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Milestone {
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
  progress: number;
  milestones: Milestone[];
}

interface GoalItemProps {
  goal: Goal;
  onStatusUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItem({ goal, onStatusUpdate, onDelete }: GoalItemProps) {
  const [showMilestones, setShowMilestones] = useState(false);

  return (
    <Card className="p-6 bg-white/70 backdrop-blur-sm">
      <div className="space-y-4">
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

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {goal.milestones && goal.milestones.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center py-2"
              onClick={() => setShowMilestones(!showMilestones)}
            >
              <span className="text-sm font-medium">
                Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
              </span>
              {showMilestones ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {showMilestones && (
              <div className="space-y-2 pl-4">
                {goal.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {milestone.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={cn(
                      "text-sm",
                      milestone.completed && "line-through text-muted-foreground"
                    )}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}