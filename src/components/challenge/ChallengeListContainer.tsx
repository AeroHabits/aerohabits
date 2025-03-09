
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
import { Challenge, Profile } from "@/types";
import { useNetworkQuality } from "@/hooks/useNetworkQuality";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, WifiOff } from "lucide-react";

export function ChallengeListContainer() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard" | "master">("easy");
  const { challenges, userChallenges, userProfile, isLoading, isError, joinChallengeMutation, refetchChallenges } = useChallenges();
  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(null);
  const [canAccessMaster, setCanAccessMaster] = useState(false);
  const [canAccessSelected, setCanAccessSelected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { networkQuality, isOnline } = useNetworkQuality();

  useEffect(() => {
    const checkDifficultyAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
  
        // Check access for selected difficulty
        const { data: canAccess, error } = await supabase.rpc('can_access_difficulty', {
          user_uid: user.id,
          target_difficulty: selectedDifficulty.toLowerCase()
        });
  
        if (error) {
          console.error('Error checking difficulty access:', error);
          return;
        }
  
        setCanAccessSelected(canAccess);
  
        // Check master access specifically
        const { data: masterAccess, error: masterError } = await supabase.rpc('can_access_difficulty', {
          user_uid: user.id,
          target_difficulty: 'master'
        });
  
        if (!masterError) {
          setCanAccessMaster(!!masterAccess);
        }
      } catch (err) {
        console.error("Error checking difficulty access:", err);
        // If offline, default to allowing access
        if (!isOnline) {
          setCanAccessSelected(true);
        }
      }
    };

    checkDifficultyAccess();
  }, [selectedDifficulty, userChallenges, isOnline]);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const challengeArray = challenges as Challenge[] || [];
      const challenge = challengeArray.find(c => c.id === challengeId);
      if (!challenge) return;
  
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to join challenges");
        return;
      }
  
      if (!isOnline) {
        toast.error("Cannot join challenges while offline", {
          description: "Please connect to the internet and try again."
        });
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
  
      const success = await joinChallengeMutation(challengeId);
      if (success) {
        setCurrentChallengeId(challengeId);
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("Failed to join challenge");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchChallenges();
      toast.success("Challenges refreshed");
    } catch (error) {
      toast.error("Failed to refresh challenges");
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredChallenges = ((challenges as Challenge[]) || []).filter(challenge => 
    challenge.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
  )?.sort((a, b) => (a.sequence_order || 0) - (b.sequence_order || 0));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError && (!challenges || (challenges as Challenge[]).length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Unable to load challenges</h3>
        <p className="text-blue-100 mb-6">
          {!isOnline 
            ? "You appear to be offline. Challenges require an internet connection." 
            : "We encountered a problem loading your challenges. This could be due to network issues."}
        </p>
        <Button 
          onClick={handleRefresh} 
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </div>
    );
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
      {!isOnline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/80 text-white px-4 py-3 rounded-lg flex items-center gap-3 mb-4"
        >
          <WifiOff className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">You're currently offline</h3>
            <p className="text-sm">Some challenge features may be limited until you reconnect.</p>
          </div>
        </motion.div>
      )}
      
      <ChallengeHero />
      
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeDifficultyGuide />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeDifficultyTabs 
          onDifficultyChange={setSelectedDifficulty}
          currentDifficulty={(userProfile as Profile)?.current_difficulty as "easy" | "medium" | "hard" | "master" || 'easy'}
          canAccessMaster={canAccessMaster}
        />
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
        <ChallengeGrid 
          challenges={filteredChallenges || []}
          userChallenges={(userChallenges as string[]) || []}
          onJoinChallenge={handleJoinChallenge}
          userPoints={(userProfile as Profile)?.total_points || 0}
          canAccessDifficulty={canAccessSelected}
          currentChallengeId={currentChallengeId}
        />
      </motion.div>
    </motion.div>
  );
}
