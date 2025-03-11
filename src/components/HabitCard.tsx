
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { HabitTitle } from "./habit-card/HabitTitle";
import { StreakBadge } from "./habit-card/StreakBadge";
import { StreakBrokenBadge } from "./habit-card/StreakBrokenBadge";
import { CategoryTag } from "./habit-card/CategoryTag";
import { CompleteButton } from "./habit-card/CompleteButton";
import { DeleteButton } from "./habit-card/DeleteButton";
import { StreakRibbon } from "./habit-card/StreakRibbon";

interface HabitCardProps {
  id: string;
  title: string;
  description?: string;
  streak: number;
  completed: boolean;
  streak_broken?: boolean;
  last_streak?: number;
  category?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  onToggle: () => void;
  onDelete: () => void;
}

// Function to get a fun background gradient based on streak
const getStreakGradient = (streak: number, completed: boolean) => {
  if (completed) {
    if (streak >= 30) return "bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-amber-500/30";
    if (streak >= 14) return "bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-indigo-500/30";
    if (streak >= 7) return "bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30";
    return "bg-gradient-to-r from-slate-800/90 to-purple-900/30 border-purple-500/30";
  }
  return "bg-slate-800/90 border-white/10";
};

export function HabitCard({
  id,
  title,
  description,
  streak,
  completed,
  streak_broken,
  last_streak,
  category,
  onToggle,
  onDelete,
}: HabitCardProps) {
  // Show toast when streak is broken
  if (streak_broken && last_streak && last_streak > 0) {
    toast.warning(
      <div className="flex flex-col gap-2">
        <div className="font-semibold">Don't give up!</div>
        <div>You had a {last_streak} day streak going. Let's start building it back up!</div>
      </div>,
      {
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        duration: 5000,
      }
    );
  }

  // Fun animation variants for the card
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    hover: { y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className="h-full"
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 h-full flex flex-col",
        getStreakGradient(streak, completed),
        "border hover:border-white/20",
        "shadow-lg hover:shadow-xl"
      )}>
        {/* Colorful completion indicator - top border */}
        {completed && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-400"></div>
        )}
        
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <HabitTitle 
                title={title} 
                completed={completed} 
                category={category}
              />
              
              {description && (
                <p className={cn(
                  "text-sm",
                  completed ? "text-white/60" : "text-white/80"
                )}>
                  {description}
                </p>
              )}
              
              <CategoryTag category={category} />
            </div>
            
            <DeleteButton onDelete={onDelete} />
          </div>
          
          <div className="flex-grow"></div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {streak > 0 && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <StreakBadge streak={streak} />
                </motion.div>
              )}
              
              <StreakBrokenBadge 
                isVisible={!!streak_broken && !!last_streak && last_streak > 0} 
              />
            </div>
            
            <CompleteButton 
              completed={completed}
              onToggle={onToggle}
            />
          </div>
        </div>
        
        {/* Achievement ribbon for streaks */}
        <StreakRibbon streak={streak} />
      </Card>
    </motion.div>
  );
}
