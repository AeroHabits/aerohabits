
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, startOfDay } from "date-fns";
import { motion } from "framer-motion";

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
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={handleMarkComplete}
          disabled={isLoading || isCompleted}
          variant={isCompleted ? "success" : "premium"}
          size="wide"
          className={`relative overflow-hidden ${isCompleted 
            ? '' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
        >
          {isCompleted ? (
            <>
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
              <div className="flex items-center gap-2 relative z-10">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </motion.div>
                <span className="font-medium">Completed for Today!</span>
              </div>
            </>
          ) : (
            <>
              {/* Animated shine effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-20 animate-shimmer"></div>
              <div className="flex items-center gap-2 relative z-10">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Mark Today Complete</span>
              </div>
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
