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
    <Card className="relative overflow-hidden p-6 bg-white/70 backdrop-blur-sm border border-[#D3E4FD]/50 hover:border-[#9b87f5]/60 transition-all duration-200">
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
            <h3 className="font-semibold text-lg text-[#6E59A5]">{title}</h3>
            <p className="text-sm text-[#7E69AB]">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
            <Trophy className="h-4 w-4 text-[#8B5CF6]" />
            <span className="text-sm font-medium text-[#7E69AB]">Streak: {streak}</span>
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
                ? "bg-[#9b87f5] hover:bg-[#8B5CF6]"
                : "bg-[#9b87f5] hover:bg-[#8B5CF6]"
            } text-white transition-colors duration-200`}
          >
            {completed ? "Completed" : "Mark as Complete"}
          </Button>
        </motion.div>
      </motion.div>
    </Card>
  );
}