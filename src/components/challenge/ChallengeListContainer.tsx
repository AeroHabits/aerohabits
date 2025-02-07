import { motion } from "framer-motion";
import { useState } from "react";
import { ChallengeDifficultyGuide } from "./ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./ChallengeDifficultyTabs";
import { ChallengeGrid } from "./ChallengeGrid";
import { ChallengeHero } from "./ChallengeHero";
import { useChallenges } from "@/hooks/useChallenges";
import { LoadingSpinner } from "./LoadingSpinner";

export function ChallengeListContainer() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const { challenges, userChallenges, userProfile, isLoading, joinChallengeMutation } = useChallenges();

  const filteredChallenges = challenges?.filter(challenge => 
    challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
  );

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
        />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeGrid 
          challenges={filteredChallenges || []}
          userChallenges={userChallenges || []}
          onJoinChallenge={(challengeId) => joinChallengeMutation.mutate(challengeId)}
          userPoints={userProfile?.total_points || 0}
        />
      </motion.div>
    </motion.div>
  );
}