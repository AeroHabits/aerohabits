import { Card } from "@/components/ui/card";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { Trophy, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackHabitAction } from "@/lib/analytics";

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
  const handleToggle = () => {
    trackHabitAction('complete', title);
    onToggle();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackHabitAction('delete', title);
    onDelete();
  };

  return (
    <Card className="relative overflow-hidden p-6 bg-white/90 backdrop-blur-sm border border-white/40 hover:border-white/50 transition-all duration-200 shadow-lg">
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
            <h3 className="font-semibold text-xl text-gray-900">{title}</h3>
            <p className="text-base text-gray-700">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2">
            {streak > 0 ? (
              <Flame className="h-5 w-5 text-amber-500" />
            ) : (
              <Trophy className="h-5 w-5 text-amber-500" />
            )}
            <span className="text-base font-medium text-gray-900">
              {streak} Day{streak !== 1 ? 's' : ''} Streak
            </span>
          </div>
          <NotificationPreferences habitId={id} />
        </div>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleToggle}
            className={`w-full ${
              completed
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium shadow-sm transition-colors duration-200`}
          >
            {completed ? "Completed Today! 🎉" : "Mark as Complete"}
          </Button>
        </motion.div>
      </motion.div>
    </Card>
  );
}