import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ChallengeDifficultyGuide } from "./challenge/ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./challenge/ChallengeDifficultyTabs";
import { ChallengeGrid } from "./challenge/ChallengeGrid";

export function ChallengeList() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const queryClient = useQueryClient();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
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
    challenge.difficulty === selectedDifficulty
  );

  if (isLoading) {
    return <div className="text-center">Loading challenges...</div>;
  }

  return (
    <div className="space-y-6">
      <ChallengeDifficultyGuide />
      <ChallengeDifficultyTabs onDifficultyChange={setSelectedDifficulty} />
      <ChallengeGrid 
        challenges={filteredChallenges || []}
        userChallenges={userChallenges || []}
        onJoinChallenge={(challengeId) => joinChallengeMutation.mutate(challengeId)}
      />
    </div>
  );
}