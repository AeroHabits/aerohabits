
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trophy, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
        description: "Your progress has been reset. Good luck on your next attempt!",
        icon: <RefreshCw className="h-4 w-4 text-green-500" />,
        className: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20"
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
      className={`mt-4 ${isMobile ? 'pb-2' : ''}`}
    >
      <Button
        onClick={handleResetChallenge}
        disabled={isLoading}
        variant="outline"
        className="w-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-300/20 group transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={isLoading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
          </motion.div>
          <span className="font-medium">Restart Challenge</span>
          {totalCompletions > 0 && (
            <div className="flex items-center text-xs bg-amber-500/20 px-2 py-1 rounded-full ml-1 text-amber-400">
              <Trophy className="h-3 w-3 mr-1" />
              <span className="font-semibold">{totalCompletions}x</span>
            </div>
          )}
        </div>
      </Button>
    </motion.div>
  );
}
