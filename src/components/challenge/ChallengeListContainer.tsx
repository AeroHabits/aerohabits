
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChallengeDifficultyGuide } from "./ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./ChallengeDifficultyTabs";
import { ChallengeGrid } from "./ChallengeGrid";
import { ChallengeHero } from "./ChallengeHero";
import { ChallengeProgressionGuide } from "./ChallengeProgressionGuide";
import { useChallenges } from "@/hooks/useChallenges";
import { LoadingSpinner } from "./LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ChallengeListContainer() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const { challenges, userChallenges, userProfile, isLoading, joinChallengeMutation } = useChallenges();
  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(null);
  const [canAccessSelected, setCanAccessSelected] = useState(true);

  useEffect(() => {
    const checkDifficultyAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('can_access_difficulty', {
        user_uid: user.id,
        target_difficulty: selectedDifficulty.toLowerCase()
      });

      if (error) {
        console.error('Error checking difficulty access:', error);
        return;
      }

      setCanAccessSelected(data);
    };

    checkDifficultyAccess();
  }, [selectedDifficulty, userChallenges]);

  const handleJoinChallenge = async (challengeId: string) => {
    const challenge = challenges?.find(c => c.id === challengeId);
    if (!challenge) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to join challenges");
      return;
    }

    // Check if user can access this difficulty level
    const { data: canAccess, error: accessError } = await supabase.rpc('can_access_difficulty', {
      user_uid: user.id,
      target_difficulty: challenge.difficulty.toLowerCase()
    });

    if (accessError || !canAccess) {
      toast.error(
        "Complete Previous Difficulty First!", 
        {
          description: "You need to complete 80% of the challenges in your current difficulty level before progressing.",
          duration: 5000
        }
      );
      return;
    }

    // Update user's current challenge
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ current_challenge_id: challengeId })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating current challenge:', updateError);
      return;
    }

    joinChallengeMutation.mutate(challengeId);
    setCurrentChallengeId(challengeId);
  };

  const filteredChallenges = challenges?.filter(challenge => 
    challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
  )?.sort((a, b) => (a.sequence_order || 0) - (b.sequence_order || 0));

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
        <ChallengeProgressionGuide />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeDifficultyGuide />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeDifficultyTabs 
          onDifficultyChange={setSelectedDifficulty}
          currentDifficulty={userProfile?.current_difficulty || 'easy'}
        />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeGrid 
          challenges={filteredChallenges || []}
          userChallenges={userChallenges || []}
          onJoinChallenge={handleJoinChallenge}
          userPoints={userProfile?.total_points || 0}
          canAccessDifficulty={canAccessSelected}
          currentChallengeId={currentChallengeId}
        />
      </motion.div>
    </motion.div>
  );
}
