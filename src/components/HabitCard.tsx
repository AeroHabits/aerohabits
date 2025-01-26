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
        <Card className="p-6 bg-card shadow-sm border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <h3 className="font-medium text-lg text-card-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent"
                  onClick={onToggle}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
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
                <span className="font-medium cursor-help text-muted-foreground">
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