
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOptimizedDataFetching } from "./useOptimizedDataFetching";
import { Challenge, Profile } from "@/types";

export function useChallenges() {
  const queryClient = useQueryClient();

  const { data: userProfile } = useOptimizedDataFetching<Profile | null>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }

        return data;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        return null;
      }
    },
    cachePolicy: 'cache-first',
    staleTime: 300000, // 5 minutes
    criticalData: true
  });

  const { 
    data: challenges, 
    isLoading,
    isError,
    refetchOptimized: refetchChallenges
  } = useOptimizedDataFetching<Challenge[]>({
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
        // Ensure difficulty is cast to the proper union type
        difficulty: challenge.difficulty as "easy" | "medium" | "hard" | "master",
        milestones: Array.isArray(challenge.milestones) 
          ? challenge.milestones 
          : challenge.milestones 
            ? JSON.parse(challenge.milestones as string)
            : []
      }));
    },
    cachePolicy: 'network-first',
    staleTime: 300000, // 5 minutes
    criticalData: true
  });

  const { data: userChallenges } = useOptimizedDataFetching<string[]>({
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
    cachePolicy: 'cache-first',
    staleTime: 300000 // 5 minutes
  });

  const joinChallengeMutation = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_challenges")
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
        });

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["user-challenges"] });
      toast.success("Successfully joined the challenge! Let's crush this goal together! 💪");
      
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to join the challenge";
      toast.error(errorMsg);
      return false;
    }
  };

  return {
    userProfile,
    challenges,
    userChallenges,
    isLoading,
    isError,
    joinChallengeMutation,
    refetchChallenges
  };
}
