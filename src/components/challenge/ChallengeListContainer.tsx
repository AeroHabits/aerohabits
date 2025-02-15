
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChallengeDifficultyGuide } from "./ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./ChallengeDifficultyTabs";
import { ChallengeGrid } from "./ChallengeGrid";
import { ChallengeHero } from "./ChallengeHero";
import { useChallenges } from "@/hooks/useChallenges";
import { LoadingSpinner } from "./LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ChallengeListContainer() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const { challenges, userChallenges, userProfile, isLoading, joinChallengeMutation } = useChallenges();
  const [canAccessAdvanced, setCanAccessAdvanced] = useState(false);
  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdvancedAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current challenge ID and advanced access status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_challenge_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        return;
      }

      setCurrentChallengeId(profile?.current_challenge_id);

      const { data, error } = await supabase.rpc('can_access_advanced_challenges', {
        user_uid: user.id
      });

      if (error) {
        console.error('Error checking advanced access:', error);
        return;
      }

      setCanAccessAdvanced(data);
    };

    checkAdvancedAccess();
  }, [userChallenges]);

  const filteredChallenges = challenges?.filter(challenge => 
    challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
  )?.sort((a, b) => (a.sequence_order || 0) - (b.sequence_order || 0));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleJoinChallenge = async (challengeId: string) => {
    const challenge = challenges?.find(c => c.id === challengeId);
    if (!challenge) return;

    // Check if user has a current challenge
    if (currentChallengeId && currentChallengeId !== challengeId) {
      const currentChallenge = challenges?.find(c => c.id === currentChallengeId);
      toast.error(
        "Complete Current Challenge First!", 
        {
          description: `Please complete "${currentChallenge?.title}" before starting a new challenge.`,
          duration: 5000
        }
      );
      return;
    }

    if (['hard', 'master'].includes(challenge.difficulty.toLowerCase()) && !canAccessAdvanced) {
      toast.error("Complete 80% of Medium challenges to unlock advanced difficulties!");
      return;
    }

    // Update user's current challenge
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ current_challenge_id: challengeId })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating current challenge:', updateError);
        return;
      }
    }

    joinChallengeMutation.mutate(challengeId);
    setCurrentChallengeId(challengeId);
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <ChallengeHero />
      
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeDifficultyGuide />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeDifficultyTabs 
          onDifficultyChange={setSelectedDifficulty} 
        />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeGrid 
          challenges={filteredChallenges || []}
          userChallenges={userChallenges || []}
          onJoinChallenge={handleJoinChallenge}
          userPoints={userProfile?.total_points || 0}
          canAccessAdvancedChallenge={canAccessAdvanced}
          currentChallengeId={currentChallengeId}
        />
      </motion.div>
    </motion.div>
  );
}
