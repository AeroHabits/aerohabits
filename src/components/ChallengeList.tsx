import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ChallengeDifficultyGuide } from "./challenge/ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./challenge/ChallengeDifficultyTabs";
import { ChallengeGrid } from "./challenge/ChallengeGrid";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

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

  const filteredChallenges = challenges?.filter(challenge => {
    const difficultyMatch = challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const hasPremiumAccess = userProfile?.is_premium;
    
    // Show all easy challenges
    if (challenge.difficulty.toLowerCase() === 'easy') {
      return difficultyMatch;
    }
    
    // Show a preview of medium challenges even for non-premium users
    if (challenge.difficulty.toLowerCase() === 'medium' && !hasPremiumAccess) {
      return difficultyMatch;
    }
    
    // For premium challenges, check if user has premium access
    return hasPremiumAccess && difficultyMatch;
  });

  const handleDifficultyChange = (difficulty: string) => {
    if (difficulty.toLowerCase() !== 'easy' && !userProfile?.is_premium) {
      if (difficulty.toLowerCase() === 'medium') {
        toast.info("Upgrade to premium to unlock all medium challenges!", {
          duration: 5000,
        });
      } else {
        toast.error("Premium subscription required for advanced challenges");
      }
    }
    setSelectedDifficulty(difficulty);
  };

  if (isLoading) {
    return <div className="text-center">Loading challenges...</div>;
  }

  const showPremiumTeaser = selectedDifficulty === 'medium' && !userProfile?.is_premium;

  return (
    <div className="space-y-6">
      <ChallengeDifficultyGuide />
      <ChallengeDifficultyTabs onDifficultyChange={handleDifficultyChange} />
      
      {showPremiumTeaser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-purple-500 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Unlock All Medium Challenges
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Get full access to our curated collection of medium-difficulty challenges designed to push your limits and accelerate your growth.
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
              onClick={() => toast.info("Premium features coming soon!")}
            >
              Upgrade to Premium
            </Button>
          </div>
        </motion.div>
      )}

      <div className={`relative ${showPremiumTeaser ? 'group' : ''}`}>
        <ChallengeGrid 
          challenges={filteredChallenges || []}
          userChallenges={userChallenges || []}
          onJoinChallenge={(challengeId) => joinChallengeMutation.mutate(challengeId)}
        />
        
        {showPremiumTeaser && filteredChallenges && filteredChallenges.length > 2 && (
          <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}