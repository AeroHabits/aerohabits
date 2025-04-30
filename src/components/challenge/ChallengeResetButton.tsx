import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ChallengeResetButtonProps {
  userChallengeId: string;
  challengeId: string;
  isCompleted: boolean;
  onReset: () => void;
  totalCompletions?: number;
}

export function ChallengeResetButton({ 
  userChallengeId, 
  challengeId,
  isCompleted, 
  onReset,
  totalCompletions = 0
}: ChallengeResetButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResetChallenge = async () => {
    if (!isCompleted) return;
    
    setIsLoading(true);
    try {
      // First delete all challenge completions
      const { error: deleteError } = await supabase
        .from('challenge_completions')
        .delete()
        .eq('user_challenge_id', userChallengeId);

      if (deleteError) throw deleteError;

      // Then create a new user_challenge entry (keeps history of previous completions)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create a new user challenge entry
      const { data: newUserChallenge, error: insertError } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          status: 'in_progress',
          is_completed: false
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      toast.success("Challenge reset successfully!", {
        description: "Your progress has been reset. Good luck on your next attempt!"
      });

      onReset();
    } catch (error) {
      console.error('Error resetting challenge:', error);
      toast.error("Couldn't reset challenge. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCompleted) return null;

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-3"
    >
      <Button
        onClick={handleResetChallenge}
        disabled={isLoading}
        variant="outline"
        className="w-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-indigo-300/20"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-indigo-400" />
          <span>Restart Challenge</span>
          {totalCompletions > 0 && (
            <div className="flex items-center text-xs bg-amber-500/20 px-1.5 py-0.5 rounded ml-1 text-amber-400">
              <Trophy className="h-3 w-3 mr-1" />
              {totalCompletions}x
            </div>
          )}
        </div>
      </Button>
    </motion.div>
  );
}
