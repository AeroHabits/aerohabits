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
        <Card className="p-6 hover:shadow-lg transition-shadow bg-white/70 backdrop-blur-sm border-[#D3E4FD]/50 hover:border-[#33C3F0]/60">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onToggle}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6 text-[#33C3F0]" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{completed ? "Mark as incomplete" : "Mark as complete"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium cursor-help">
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