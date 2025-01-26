import { Card } from "@/components/ui/card";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { Trophy, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HabitCardProps {
  id: string;
  title: string;
  description: string;
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
  onDelete
}: HabitCardProps) {
  return (
    <Card className="relative overflow-hidden p-6 bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200">
      <motion.div
        initial={false}
        animate={{
          scale: completed ? 1 : 1,
          opacity: completed ? 0.8 : 1
        }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-xl text-white drop-shadow-sm">{title}</h3>
            <p className="text-base text-white/90 drop-shadow-sm">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-red-200 hover:bg-red-500/20"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
            {streak > 0 ? (
              <Flame className="h-5 w-5 text-orange-400" />
            ) : (
              <Trophy className="h-5 w-5 text-yellow-300" />
            )}
            <span className="text-base font-medium text-white drop-shadow-sm">
              {streak} Day{streak !== 1 ? 's' : ''} Streak
            </span>
          </div>
          <NotificationPreferences habitId={id} />
        </div>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onToggle}
            className={`w-full ${
              completed
                ? "bg-green-500/50 hover:bg-green-500/60"
                : "bg-white/30 hover:bg-white/40"
            } text-white font-medium shadow-sm transition-colors duration-200`}
          >
            {completed ? "Completed Today! 🎉" : "Mark as Complete"}
          </Button>
        </motion.div>
      </motion.div>
    </Card>
  );
}