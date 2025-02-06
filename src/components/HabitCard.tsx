
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface HabitCardProps {
  id: string;
  title: string;
  description?: string;
  streak: number;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function HabitCard({
  id,
  title,
  description,
  streak,
  completed,
  onToggle,
  onDelete,
}: HabitCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        "bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg",
        "border border-white/10 hover:border-white/20",
        "shadow-2xl"
      )}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-white/90">{title}</h3>
              {description && (
                <p className="text-white/80">{description}</p>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-red-400 hover:bg-red-400/10"
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {streak > 0 && (
                <div className="flex items-center space-x-1 text-blue-300">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium text-white/90">{streak} day streak!</span>
                </div>
              )}
            </div>
            <Button
              onClick={onToggle}
              className={cn(
                "transition-all duration-300",
                completed 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              )}
            >
              {completed ? (
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
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
          <div className="absolute -right-12 top-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-12 py-1 rotate-45 transform text-sm font-semibold shadow-lg">
            Champion!
          </div>
        )}
      </Card>
    </motion.div>
  );
}
