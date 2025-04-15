
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

  // iOS-optimized streak notification
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
        "relative overflow-hidden transition-all duration-300 h-full",
        completed 
          ? "bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-blue-500/30" 
          : "bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10",
        "backdrop-blur-xl border shadow-xl hover:shadow-2xl",
        "group"
      )}>
        <div className="p-6 flex flex-col h-full relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                {category && (
                  <div 
                    className="p-2 rounded-xl shadow-lg"
                    style={{ 
                      backgroundColor: `${category.color}15`,
                      boxShadow: `0 0 20px ${category.color}10`
                    }}
                  >
                    <LucideIcon 
                      className="h-5 w-5"
                      style={{ color: category.color }}
                    />
                  </div>
                )}
                <h3 className="font-semibold text-xl text-white/90 tracking-tight">{title}</h3>
              </div>
              {description && (
                <p className="text-white/70 text-sm font-medium">{description}</p>
              )}
              {category && (
                <span 
                  className="text-xs px-3 py-1 rounded-full inline-flex items-center gap-1.5 font-medium" 
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    color: category.color,
                    boxShadow: `0 0 15px ${category.color}10`
                  }}
                >
                  <LucideIcon className="h-3.5 w-3.5" />
                  {category.name}
                </span>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                >
                  <Trash2 className="h-4 w-4" />
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
          
          <div className="flex items-center justify-between mt-4 gap-3">
            <div className="flex items-center space-x-2">
              {streak > 0 && (
                <div className="flex items-center gap-1.5 text-blue-300/90 bg-blue-500/10 px-3 py-1.5 rounded-full">
                  <Trophy className="h-4 w-4" />
                  <span className="font-medium text-sm">{streak} day streak!</span>
                </div>
              )}
              {streak_broken && last_streak && last_streak > 0 && (
                <div className="flex items-center gap-1.5 text-yellow-300/90 bg-yellow-500/10 px-3 py-1.5 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium text-sm">Start again!</span>
                </div>
              )}
            </div>
            <Button
              onClick={onToggle}
              variant={completed ? "default" : "secondary"}
              size="sm"
              className={cn(
                "transition-all duration-300 rounded-xl shadow-lg",
                completed 
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none" 
                  : "bg-white/5 hover:bg-white/10 text-white/90"
              )}
            >
              {completed ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete</span>
                </div>
              ) : (
                "Complete"
              )}
            </Button>
          </div>
        </div>
        
        {/* Refined achievement ribbon */}
        {streak >= 7 && (
          <div className="absolute -right-12 top-7 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white px-14 py-1 rotate-45 transform text-xs font-medium shadow-lg backdrop-blur-sm">
            Champion!
          </div>
        )}
        
        {/* Subtle completion indicator */}
        {completed && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400/50 via-blue-500/50 to-indigo-500/50"></div>
        )}
        
        {/* Background glow effect */}
        <div 
          className="absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: completed 
              ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)' 
              : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%)'
          }}
        />
      </Card>
    </motion.div>
  );
}
