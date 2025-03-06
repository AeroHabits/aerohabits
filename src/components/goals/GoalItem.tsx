
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2, CheckCircle, Circle, Clock, Target, Trophy, Star } from "lucide-react";
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
  // Function to get background color based on goal status
  const getCardBackground = () => {
    if (goal.status === 'completed') {
      return "bg-emerald-50 dark:bg-emerald-900/20";
    }
    return "bg-white dark:bg-gray-800";
  };

  // Animation variants for the card
  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.25, ease: "easeOut" }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.15 }
    }
  };

  // Get icon based on status
  const getStatusIcon = () => {
    if (goal.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    }
    return <Circle className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />;
  };

  // Get progress color
  const getProgressColor = () => {
    if (goal.status === 'completed') {
      return "text-emerald-600";
    }
    if (goal.progress > 0) {
      return "text-blue-600";
    }
    return "text-gray-600";
  };

  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`p-6 border ${getCardBackground()} shadow-sm`}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStatusUpdate(goal.id)}
                  className="p-0 h-auto w-auto"
                >
                  {getStatusIcon()}
                </Button>
                <h3 className={cn(
                  "font-bold text-lg text-gray-900 dark:text-white",
                  goal.status === 'completed' && "line-through text-gray-500"
                )}>
                  {goal.title}
                </h3>
              </div>
              {goal.description && (
                <div className="pl-7">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
                </div>
              )}
              {goal.target_date && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pl-7">
                  <Clock className="mr-2 h-4 w-4" />
                  {format(new Date(goal.target_date), "PPP")}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(goal.id)}
              className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                {goal.status === 'completed' ? (
                  <Trophy className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Target className="h-5 w-5 text-blue-500" />
                )}
                <span className="ml-1 font-medium">Progress</span>
              </div>
              <span className={`font-bold ${getProgressColor()}`}>
                {goal.progress}%
              </span>
            </div>
            <Progress value={goal.progress} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
