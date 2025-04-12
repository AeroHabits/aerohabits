
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ChallengeCompletion } from "./ChallengeCompletion";
import { format, startOfDay, parseISO, isAfter, isBefore, subDays, isToday } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChallengeProgressProps {
  daysCompleted: number;
  totalDays: number;
  startDate: string | null;
  userChallengeId: string;
  onProgressUpdate: () => void;
}

export function ChallengeProgress({
  daysCompleted,
  totalDays,
  startDate,
  userChallengeId,
  onProgressUpdate
}: ChallengeProgressProps) {
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!userChallengeId) return;
      
      // Format today's date in UTC to match the database format
      const today = startOfDay(new Date());
      const yesterday = subDays(today, 1);
      const todayStr = format(today, 'yyyy-MM-dd');
      
      // Get all completions for this challenge
      const { data: completions, error } = await supabase
        .from('challenge_completions')
        .select('completed_date')
        .eq('user_challenge_id', userChallengeId)
        .order('completed_date', { ascending: false });

      if (error) {
        console.error('Error checking completions:', error);
        return;
      }

      // Check if completed today
      const completedToday = completions?.some(c => {
        // Parse the completion date and check if it's today
        const completionDate = parseISO(c.completed_date);
        return isToday(completionDate);
      });
      
      setIsCompletedToday(!!completedToday);

      // If there are completions, check for missed days
      if (completions && completions.length > 0 && completions[0].completed_date) {
        const lastCompletionDate = parseISO(completions[0].completed_date);
        
        // If the last completion was before yesterday, it means a day was missed
        if (isAfter(yesterday, lastCompletionDate) && 
            // Only reset if the challenge has been started (has at least one completion)
            // and if the last completion wasn't on the start date
            completions.length > 0 && 
            (startDate ? !isBefore(lastCompletionDate, parseISO(startDate)) : true)) {
          
          // Reset the challenge
          const { error: resetError } = await supabase
            .from('challenge_completions')
            .delete()
            .eq('user_challenge_id', userChallengeId);

          if (resetError) {
            console.error('Error resetting challenge:', resetError);
            return;
          }

          // Update the UI
          onProgressUpdate();
          
          // Show a more prominent notification about the streak loss
          toast.error("Challenge Progress Reset!", {
            description: "You missed a day in your challenge! Your progress has been reset and you'll need to start over. Remember to complete your challenge daily to maintain your streak!",
            duration: 6000, // Show for 6 seconds
            action: {
              label: "Got it",
              onClick: () => console.log("User acknowledged challenge reset")
            }
          });
        }
      }
    };

    checkProgress();
  }, [userChallengeId, onProgressUpdate, startDate]);

  const progress = (daysCompleted / totalDays) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress: {daysCompleted}/{totalDays} days</span>
        {startDate && (
          <span>Started: {new Date(startDate).toLocaleDateString()}</span>
        )}
      </div>
      <Progress value={progress} className="h-2" />
      <ChallengeCompletion
        userChallengeId={userChallengeId}
        onComplete={onProgressUpdate}
        isCompleted={isCompletedToday}
      />
    </div>
  );
}
