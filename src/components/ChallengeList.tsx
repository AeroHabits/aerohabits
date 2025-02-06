import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ChallengeDifficultyGuide } from "./challenge/ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./challenge/ChallengeDifficultyTabs";
import { ChallengeGrid } from "./challenge/ChallengeGrid";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChallengeHero } from "./challenge/ChallengeHero";
import { LoadingSpinner } from "./challenge/LoadingSpinner";

export function ChallengeList() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching challenges:", error);
        throw error;
      }
      
      return data.map(challenge => ({
        ...challenge,
        milestones: Array.isArray(challenge.milestones) 
          ? challenge.milestones 
          : challenge.milestones 
            ? JSON.parse(challenge.milestones as string)
            : []
      }));
    },
  });

  const { data: userChallenges } = useQuery({
    queryKey: ["user-challenges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_challenges")
        .select("challenge_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map(uc => uc.challenge_id);
    },
  });

  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_challenges")
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-challenges"] });
    },
  });

  const filteredChallenges = challenges?.filter(challenge => 
    challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
  );

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

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
        <ChallengeDifficultyTabs onDifficultyChange={handleDifficultyChange} />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeGrid 
          challenges={filteredChallenges || []}
          userChallenges={userChallenges || []}
          onJoinChallenge={(challengeId) => joinChallengeMutation.mutate(challengeId)}
        />
      </motion.div>
    </motion.div>
  );
}