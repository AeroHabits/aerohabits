import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, startOfDay } from "date-fns";

interface ChallengeCompletionProps {
  userChallengeId: string;
  onComplete: () => void;
  isCompleted: boolean;
}

export function ChallengeCompletion({ userChallengeId, onComplete, isCompleted }: ChallengeCompletionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    setIsLoading(true);
    try {
      // Format today's date in UTC to match the database format
      const today = format(startOfDay(new Date()), 'yyyy-MM-dd');

      const { error } = await supabase
        .from('challenge_completions')
        .insert({
          user_challenge_id: userChallengeId,
          completed_date: today
        });

      if (error) {
        console.error('Error marking completion:', error);
        throw error;
      }
      
      toast.success("Great job! You've completed today's challenge! 🎉");
      onComplete();
    } catch (error) {
      console.error('Error marking completion:', error);
      toast.error("Couldn't mark today's completion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Button
        onClick={handleMarkComplete}
        disabled={isLoading || isCompleted}
        className={`w-full ${isCompleted ? 'bg-green-500 hover:bg-green-600' : ''}`}
      >
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed for Today!</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <span>Mark Today Complete</span>
            </>
          )}
        </div>
      </Button>
    </div>
  );
}