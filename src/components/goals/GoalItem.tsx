
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
  progress: number;
}

interface GoalItemProps {
  goal: Goal;
  onStatusUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalItem({ goal, onStatusUpdate, onDelete }: GoalItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90" />
        
        {/* Card Content */}
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStatusUpdate(goal.id)}
                  className="hover:bg-white/5 p-0 h-auto"
                >
                  {goal.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-blue-400 transition-colors" />
                  )}
                </Button>
                <h3 className={cn(
                  "text-lg font-semibold text-white tracking-tight",
                  goal.status === 'completed' && "line-through text-white/50"
                )}>
                  {goal.title}
                </h3>
              </div>
              {goal.description && (
                <p className="text-sm text-gray-300/80 leading-relaxed">
                  {goal.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.id)}
              className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full -mr-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Progress</span>
              <span className="text-gray-300 font-semibold">{goal.progress}%</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-gray-800/50">
              <Progress 
                value={goal.progress} 
                className="h-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
          </div>

          {goal.target_date && (
            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                Target Date: 
                <span className="text-gray-300 font-medium">
                  {format(new Date(goal.target_date), "PPP")}
                </span>
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
