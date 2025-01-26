import { Card } from "@/components/ui/card";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { Trophy } from "lucide-react";
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
    <Card className="relative overflow-hidden p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200">
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
            <h3 className="font-semibold text-lg text-white">{title}</h3>
            <p className="text-sm text-white/80">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-white/80">Streak: {streak}</span>
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
                ? "bg-white/20 hover:bg-white/30"
                : "bg-white/20 hover:bg-white/30"
            } text-white transition-colors duration-200`}
          >
            {completed ? "Completed" : "Mark as Complete"}
          </Button>
        </motion.div>
      </motion.div>
    </Card>
  );
}