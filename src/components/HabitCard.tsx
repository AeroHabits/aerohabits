
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Star, Trophy, AlertCircle, CheckCircle, Zap, Target, Heart, Smile, Music, Book, Coffee, Code } from "lucide-react";
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

// Function to get random cheerful phrases for completed habits
const getCompletionPhrase = () => {
  const phrases = [
    "Great job!",
    "Way to go!",
    "Awesome!",
    "You did it!",
    "Fantastic!",
    "Brilliant!",
    "Well done!",
    "Keep it up!",
    "Amazing!",
    "Superb!"
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

// Function to get fun icon based on streak
const getStreakIcon = (streak: number) => {
  if (streak >= 30) return <Trophy className="h-5 w-5 text-amber-400" />;
  if (streak >= 14) return <Zap className="h-5 w-5 text-indigo-400" />;
  if (streak >= 7) return <Star className="h-5 w-5 text-blue-400" />;
  return <Target className="h-5 w-5 text-purple-400" />;
};

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

  // Fun animation variants for the card
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    hover: { y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
  };

  // Fun animation for the completed indicator
  const completedVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: completed ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 },
    transition: { type: "spring", stiffness: 260, damping: 20 }
  };

  // Celebration animation for the title when completed
  const titleVariants = {
    initial: { scale: 1 },
    animate: completed ? 
      {
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, repeat: 0 }
      } : {}
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
                <motion.h3 
                  variants={titleVariants}
                  className={cn(
                    "font-semibold text-lg",
                    completed ? "text-purple-200 line-through opacity-70" : "text-white/90"
                  )}
                >
                  {title}
                </motion.h3>
                {completed && (
                  <motion.div
                    variants={completedVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <CheckCircle className="h-5 w-5 text-purple-400" />
                  </motion.div>
                )}
              </div>
              {description && (
                <p className={cn(
                  "text-sm",
                  completed ? "text-white/60" : "text-white/80"
                )}>
                  {description}
                </p>
              )}
              {category && (
                <span 
                  className="text-xs px-2 py-1 rounded-full inline-flex items-center mt-2" 
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
                <motion.div 
                  className="flex items-center space-x-1 text-purple-300 bg-purple-400/10 px-2 py-1 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  {getStreakIcon(streak)}
                  <span className="font-medium text-white/90 text-sm">{streak} day streak!</span>
                </motion.div>
              )}
              {streak_broken && last_streak && last_streak > 0 && (
                <div className="flex items-center space-x-1 text-yellow-300 bg-yellow-400/10 px-2 py-1 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium text-white/90 text-sm">Start again!</span>
                </div>
              )}
            </div>
            <Button
              onClick={onToggle}
              variant={completed ? "success" : "outline"}
              size="sm"
              className={cn(
                "transition-all duration-300",
                completed 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none" 
                  : "bg-transparent border-white/20 text-white hover:bg-white/10"
              )}
            >
              {completed ? (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>{getCompletionPhrase()}</span>
                </div>
              ) : (
                "Complete"
              )}
            </Button>
          </div>
        </div>
        
        {/* Achievement ribbon for streaks */}
        {streak >= 7 && (
          <div className={cn(
            "absolute -right-12 top-6 text-white px-12 py-1 rotate-45 transform text-sm font-semibold shadow-lg",
            streak >= 30 ? "bg-gradient-to-r from-amber-500 to-yellow-500" :
            streak >= 14 ? "bg-gradient-to-r from-indigo-500 to-blue-500" :
            "bg-gradient-to-r from-purple-500 to-indigo-500"
          )}>
            {streak >= 30 ? "Master!" : streak >= 14 ? "Expert!" : "Champion!"}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
