import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/90"
            onClick={onDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          {streak > 0 && (
            <p className="text-sm text-muted-foreground">
              {streak} day streak
            </p>
          )}
          <Button
            onClick={onToggle}
            variant={completed ? "secondary" : "default"}
            className="ml-auto"
          >
            {completed ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : (
              "Complete"
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}