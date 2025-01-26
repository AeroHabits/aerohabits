import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { NotificationPreferences } from "./NotificationPreferences";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface HabitCardProps {
  id: string;
  title: string;
  description: string;
  streak: number;
  completed: boolean;
  onToggle: () => void;
}

export function HabitCard({ id, title, description, streak, completed, onToggle }: HabitCardProps) {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="p-6 bg-gradient-to-br from-[#FEF7CD]/50 to-[#E5DEFF]/50 backdrop-blur-sm shadow-lg border border-[#D3E4FD]/50 hover:border-[#33C3F0]/60 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg text-[#6E59A5]">{title}</h3>
              <p className="text-sm text-[#7E69AB]">{description}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-[#E5DEFF]"
                  onClick={onToggle}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6 text-[#8B5CF6] animate-scale-in" />
                  ) : (
                    <Circle className="h-6 w-6 text-[#7E69AB]" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{completed ? "Mark as incomplete" : "Mark as complete"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium cursor-help text-[#7E69AB] hover:text-[#6E59A5] transition-colors">
                  {streak} day streak
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Complete this habit daily to build your streak!</p>
              </TooltipContent>
            </Tooltip>
            <NotificationPreferences habitId={id} />
          </div>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}