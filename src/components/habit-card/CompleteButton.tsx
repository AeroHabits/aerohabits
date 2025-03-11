
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CompleteButtonProps {
  completed: boolean;
  onToggle: () => void;
  isPending?: boolean;
}

export function CompleteButton({ completed, onToggle, isPending = false }: CompleteButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        onClick={onToggle}
        variant={completed ? "success" : "outline"}
        size="sm"
        disabled={isPending}
        className={cn(
          "transition-all duration-300",
          completed 
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none" 
            : "bg-transparent border-white/20 text-white hover:bg-white/10",
          isPending && "opacity-80"
        )}
      >
        {isPending ? (
          <div className="flex items-center space-x-1">
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            <span>Updating...</span>
          </div>
        ) : completed ? (
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Completed</span>
          </div>
        ) : (
          "Complete"
        )}
      </Button>
    </motion.div>
  );
}
