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
        completed ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20" : "bg-white/90",
        "hover:shadow-lg border-2",
        completed ? "border-green-500/30" : "border-blue-500/30"
      )}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
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
                <div className="flex items-center space-x-1 text-amber-500">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">{streak} day streak!</span>
                </div>
              )}
            </div>
            <Button
              onClick={onToggle}
              variant={completed ? "secondary" : "default"}
              className={cn(
                "transition-all duration-300",
                completed && "bg-green-500 hover:bg-green-600 text-white"
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
          <div className="absolute -right-12 top-6 bg-amber-500 text-white px-12 py-1 rotate-45 transform text-sm font-semibold">
            Champion!
          </div>
        )}
      </Card>
    </motion.div>
  );
}