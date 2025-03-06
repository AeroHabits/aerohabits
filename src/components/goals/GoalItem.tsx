
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
  // Function to get background gradient based on goal progress
  const getCardBackground = () => {
    if (goal.status === 'completed') {
      return "bg-gradient-to-r from-emerald-400/20 to-teal-400/20 backdrop-blur-lg";
    }
    if (goal.progress > 50) {
      return "bg-gradient-to-r from-indigo-400/20 to-blue-400/20 backdrop-blur-lg";
    }
    return "bg-gradient-to-r from-blue-400/10 to-indigo-400/10 backdrop-blur-lg";
  };

  // Animation variants for the card
  const cardVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px -10px rgba(100, 116, 139, 0.2)",
      transition: { duration: 0.25, ease: "easeOut" }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 5px 15px -5px rgba(100, 116, 139, 0.1)",
      transition: { duration: 0.15 }
    }
  };

  // Get icon based on progress
  const getProgressIcon = () => {
    if (goal.status === 'completed') {
      return <Trophy className="h-5 w-5 text-emerald-500" />;
    }
    if (goal.progress > 50) {
      return <Star className="h-5 w-5 text-amber-400" />;
    }
    return <Target className="h-5 w-5 text-blue-500" />;
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
      <Card className={`p-6 border border-white/10 hover:border-white/20 shadow-xl ${getCardBackground()} transition-all duration-300 overflow-hidden relative`}>
        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
        <div className="absolute -left-6 -bottom-6 w-20 h-20 rounded-full bg-indigo-500/5 blur-xl"></div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStatusUpdate(goal.id)}
                    className="hover:bg-indigo-400/10 p-0 h-auto w-auto"
                  >
                    {goal.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-indigo-400 hover:text-blue-500 transition-colors" />
                    )}
                  </Button>
                </motion.div>
                <h3 className={cn(
                  "font-bold text-lg",
                  goal.status === 'completed' ? "line-through text-muted-foreground" : "text-white"
                )}>
                  {goal.title}
                </h3>
              </div>
              {goal.description && (
                <div className="pl-7">
                  <p className="text-sm text-blue-100/70">{goal.description}</p>
                </div>
              )}
              {goal.target_date && (
                <div className="flex items-center text-sm text-blue-100/70 pl-7">
                  <Clock className="mr-2 h-4 w-4 text-indigo-300" />
                  {format(new Date(goal.target_date), "PPP")}
                </div>
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(goal.id)}
                className="text-red-400 hover:text-red-500 hover:bg-red-400/10 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-sm text-blue-100/70">
              <div className="flex items-center gap-1">
                {getProgressIcon()}
                <span className="ml-1 font-medium">Progress</span>
              </div>
              <motion.div 
                animate={{ scale: goal.progress === 100 ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: goal.progress === 100 ? Infinity : 0, repeatDelay: 1.5 }}
                className={cn(
                  "font-bold",
                  goal.progress === 100 ? "text-emerald-400" : "text-indigo-300"
                )}
              >
                {goal.progress}%
              </motion.div>
            </div>
            <div className="relative">
              <Progress 
                value={goal.progress} 
                className="h-2.5 bg-slate-700/40"
              />
              {/* Animated glow effect for completed goals */}
              {goal.status === 'completed' && (
                <motion.div 
                  className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
