
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ChallengeDifficultyGuide } from "./challenge/ChallengeDifficultyGuide";
import { ChallengeDifficultyTabs } from "./challenge/ChallengeDifficultyTabs";
import { ChallengeGrid } from "./challenge/ChallengeGrid";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Zap, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
    
    // For medium and above difficulties, check if user has premium access
    if (challenge.difficulty.toLowerCase() === 'medium' || 
        challenge.difficulty.toLowerCase() === 'hard' || 
        challenge.difficulty.toLowerCase() === 'master') {
      return hasPremiumAccess && difficultyMatch;
    }
    
    return false;
  });

  const handleDifficultyChange = (difficulty: string) => {
    if (difficulty.toLowerCase() !== 'easy' && !userProfile?.is_premium) {
      toast.error("Premium subscription required for advanced challenges");
      return;
    }
    setSelectedDifficulty(difficulty);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Trophy className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div 
        variants={item}
        className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 p-6 rounded-lg backdrop-blur-sm border border-purple-400/30 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">
            Epic Challenges Await!
          </h2>
        </div>
        <p className="text-gray-100">
          Push your limits, achieve greatness, and unlock rewards along the way.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <ChallengeDifficultyGuide />
      </motion.div>

      <motion.div variants={item}>
        <ChallengeDifficultyTabs onDifficultyChange={handleDifficultyChange} />
      </motion.div>
      
      {!userProfile?.is_premium && selectedDifficulty.toLowerCase() !== 'easy' && (
        <motion.div
          variants={item}
          className="relative p-6 rounded-lg bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 mb-8 overflow-hidden shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-gradient-x" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    Unlock Premium Features
                  </h3>
                  <p className="text-sm text-gray-100 max-w-md">
                    Take your personal growth to the next level with premium challenges and exclusive features.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-100">Advanced Challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-100">Personalized Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-100">Expert Guidance</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Medium Challenges
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Hard Challenges
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    Master Challenges
                  </Badge>
                </div>
              </div>
              <div className="hidden md:block">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg"
                  onClick={() => toast.info("Premium features coming soon!")}
                >
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={item}>
        <ChallengeGrid 
          challenges={filteredChallenges || []}
          userChallenges={userChallenges || []}
          onJoinChallenge={(challengeId) => joinChallengeMutation.mutate(challengeId)}
        />
      </motion.div>

      {/* Mobile upgrade button */}
      {!userProfile?.is_premium && selectedDifficulty.toLowerCase() !== 'easy' && (
        <motion.div 
          className="md:hidden fixed bottom-4 left-4 right-4 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg"
            onClick={() => toast.info("Premium features coming soon!")}
          >
            Upgrade to Premium
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
