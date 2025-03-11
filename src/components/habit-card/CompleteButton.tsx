
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { motion } from "framer-motion";

interface CompleteButtonProps {
  completed: boolean;
  onToggle: () => void;
  isPending?: boolean;
}

// Use memo to prevent unnecessary re-renders
export const CompleteButton = memo(function CompleteButton({ 
  completed, 
  onToggle, 
  isPending = false 
}: CompleteButtonProps) {
  // Memoize class names to prevent recalculation
  const buttonClass = cn(
    "transition-all duration-300",
    completed 
      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none" 
      : "bg-transparent border-white/20 text-white hover:bg-white/10",
    isPending && "opacity-80"
  );

  // Early return for different states to reduce render complexity
  if (isPending) {
    return (
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button onClick={onToggle} variant={completed ? "success" : "outline"} size="sm" disabled={true} className={buttonClass}>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          <span>Updating...</span>
        </Button>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button onClick={onToggle} variant="success" size="sm" className={buttonClass}>
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Completed</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button onClick={onToggle} variant="outline" size="sm" className={buttonClass}>
        Complete
      </Button>
    </motion.div>
  );
});
