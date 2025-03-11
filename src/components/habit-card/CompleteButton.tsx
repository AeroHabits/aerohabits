
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompleteButtonProps {
  completed: boolean;
  onToggle: () => void;
}

export function CompleteButton({ completed, onToggle }: CompleteButtonProps) {
  return (
    <Button
      onClick={onToggle}
      variant={completed ? "success" : "outline"}
      size="sm"
      className={cn(
        "transition-all duration-300",
        completed 
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none" 
          : "bg-transparent border-white/20 text-white hover:bg-white/10"
      )}
    >
      {completed ? (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Completed</span>
        </div>
      ) : (
        "Complete"
      )}
    </Button>
  );
}
