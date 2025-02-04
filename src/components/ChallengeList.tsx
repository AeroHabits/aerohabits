import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ChallengeDifficultyGuide } from "./challenge/ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./challenge/ChallengeDifficultyTabs";
import { ChallengeGrid } from "./challenge/ChallengeGrid";
import { toast } from "sonner";

export function ChallengeList() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("easy");
  const queryClient = useQueryClient();

  // Add a query to check if user has premium subscription
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
      
      console.log("Fetched challenges:", data);
      
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

  const filteredChallenges = challenges?.filter(challenge => {
    const difficultyMatch = challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    // If it's an easy challenge, show it to everyone
    if (challenge.difficulty.toLowerCase() === 'easy') {
      return difficultyMatch;
    }
    
    // For medium, hard, and master challenges, check if user has premium access
    const hasPremiumAccess = userProfile?.is_premium;
    
    if (!hasPremiumAccess) {
      return false;
    }
    
    return difficultyMatch;
  });

  console.log("Selected difficulty:", selectedDifficulty);
  console.log("Filtered challenges:", filteredChallenges);

  if (isLoading) {
    return <div className="text-center">Loading challenges...</div>;
  }

  const handleDifficultyChange = (difficulty: string) => {
    if (difficulty.toLowerCase() !== 'easy' && !userProfile?.is_premium) {
      toast.error("Premium subscription required for advanced challenges");
      return;
    }
    setSelectedDifficulty(difficulty);
  };

  return (
    <div className="space-y-6">
      <ChallengeDifficultyGuide />
      <ChallengeDifficultyTabs onDifficultyChange={handleDifficultyChange} />
      <ChallengeGrid 
        challenges={filteredChallenges || []}
        userChallenges={userChallenges || []}
        onJoinChallenge={(challengeId) => joinChallengeMutation.mutate(challengeId)}
      />
    </div>
  );
}