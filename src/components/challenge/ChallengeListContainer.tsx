
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChallengeDifficultyGuide } from "./ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./ChallengeDifficultyTabs";
import { ChallengeGrid } from "./ChallengeGrid";
import { ChallengeHero } from "./ChallengeHero";
import { LoadingSpinner } from "./LoadingSpinner";
import { useChallenges } from "@/hooks/useChallenges";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ChallengeListContainer() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const { challenges, userChallenges, userProfile, isLoading, joinChallengeMutation } = useChallenges();
  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(null);
  const [canAccessMaster, setCanAccessMaster] = useState(true); // Changed to true to always allow access
  const [canAccessSelected, setCanAccessSelected] = useState(true); // Changed to true to always allow access

  useEffect(() => {
    const checkDifficultyAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Set current challenge ID if user has one
      if (userProfile?.current_challenge_id) {
        setCurrentChallengeId(userProfile.current_challenge_id);
      }

      // Always allow access to all difficulty levels
      setCanAccessSelected(true);
      setCanAccessMaster(true);
    };

    checkDifficultyAccess();
  }, [selectedDifficulty, userChallenges, userProfile]);

  const handleJoinChallenge = async (challengeId: string) => {
    const challenge = challenges?.find(c => c.id === challengeId);
    if (!challenge) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to join challenges");
      return;
    }

    // Allow joining any challenge regardless of difficulty
    
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
        <ChallengeDifficultyGuide />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeDifficultyTabs 
          onDifficultyChange={setSelectedDifficulty}
          currentDifficulty={userProfile?.current_difficulty || 'easy'}
          canAccessMaster={canAccessMaster}
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
