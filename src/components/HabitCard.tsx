
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Star, Trophy, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { icons } from "lucide-react";
import { toast } from "sonner";

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
  const LucideIcon = category?.icon ? (icons as any)[category.icon] : Star;

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 h-full flex flex-col",
        completed 
          ? "bg-slate-800/90 border-[#9b87f5]/30" 
          : "bg-slate-800/90 border-white/10",
        "border hover:border-white/20",
        "shadow-lg hover:shadow-xl"
      )}>
        {/* Professional completion indicator - top border */}
        {completed && (
          <div className="absolute top-0 left-0 w-full h-1 bg-[#9b87f5]"></div>
        )}
        
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {category && (
                  <div 
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${category.color}30` }}
                  >
                    <LucideIcon 
                      className="h-4 w-4"
                      style={{ color: category.color }}
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg text-white/90">{title}</h3>
                {completed && (
                  <CheckCircle className="h-4 w-4 text-[#9b87f5]" />
                )}
              </div>
              {description && (
                <p className="text-white/80">{description}</p>
              )}
              {category && (
                <span 
                  className="text-sm px-2 py-1 rounded-full inline-flex items-center mt-2" 
                  style={{ 
                    backgroundColor: `${category.color}30`,
                    color: category.color
                  }}
                >
                  <LucideIcon className="h-3 w-3 mr-1" />
                  {category.name}
                </span>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your habit
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="flex-grow"></div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {streak > 0 && (
                <div className="flex items-center space-x-1 text-[#9b87f5]">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium text-white/90">{streak} day streak!</span>
                </div>
              )}
              {streak_broken && last_streak && last_streak > 0 && (
                <div className="flex items-center space-x-1 text-yellow-300">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium text-white/90">Start again!</span>
                </div>
              )}
            </div>
            <Button
              onClick={onToggle}
              variant={completed ? "default" : "outline"}
              size="sm"
              className={cn(
                "transition-all duration-300",
                completed 
                  ? "bg-[#9b87f5] hover:bg-[#8b76f4] text-white border-none" 
                  : "bg-transparent border-white/20 text-white hover:bg-white/10"
              )}
            >
              {completed ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Completed!</span>
                </div>
              ) : (
                "Complete"
              )}
            </Button>
          </div>
        </div>
        
        {/* Achievement ribbon for streaks */}
        {streak >= 7 && (
          <div className="absolute -right-12 top-6 bg-gradient-to-r from-[#9b87f5] to-[#7e69ab] text-white px-12 py-1 rotate-45 transform text-sm font-semibold shadow-lg">
            Champion!
          </div>
        )}
      </Card>
    </motion.div>
  );
}
