
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

  useEffect(() => {
    const checkAdvancedAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleJoinChallenge = async (challengeId: string) => {
    const challenge = challenges?.find(c => c.id === challengeId);
    if (!challenge) return;

    if (['hard', 'master'].includes(challenge.difficulty.toLowerCase()) && !canAccessAdvanced) {
      toast.error("Complete 80% of Medium challenges to unlock advanced difficulties!");
      return;
    }

    joinChallengeMutation.mutate(challengeId);
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
        />
      </motion.div>
    </motion.div>
  );
}
