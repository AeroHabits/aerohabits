
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeHeader } from "./challenge/ChallengeHeader";
import { ChallengeProgressSection } from "./challenge/ChallengeProgressSection";
import { ChallengeContent } from "./challenge/ChallengeContent";
import { ChallengeActions } from "./challenge/ChallengeActions";

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string | null;
    difficulty: string;
    duration_days: number;
    category: string | null;
    reward_points: number | null;
    completion_criteria: string | null;
    motivation_text: string | null;
    milestones: any[] | null;
    tips: string[] | null;
    sequence_order: number;
  };
  onJoin: (challengeId: string) => void;
  isJoined?: boolean;
  userPoints: number;
  canAccessDifficulty?: boolean;
  isLocked?: boolean;
  sequenceOrder: number;
}

export function ChallengeCard({ 
  challenge, 
  onJoin, 
  isJoined, 
  userPoints,
  canAccessDifficulty = true,
  isLocked = false,
  sequenceOrder
}: ChallengeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [userChallengeId, setUserChallengeId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<{
    daysCompleted: number;
    startDate: string | null;
    isCompleted: boolean;
    totalCompletions: number;
  }>({
    daysCompleted: 0,
    startDate: null,
    isCompleted: false,
    totalCompletions: 0
  });

  useEffect(() => {
    if (isJoined) {
      fetchProgress();
    }
  }, [isJoined, challenge.id]);

  const fetchProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get current challenge data
    const { data } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('challenge_id', challenge.id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      // Get completions for this specific user_challenge
      const { data: completions } = await supabase
        .from('challenge_completions')
        .select('*')
        .eq('user_challenge_id', data.id);
      
      // Get total number of times user has completed this challenge
      const { data: totalCompletionsData, error: countError } = await supabase
        .from('user_challenges')
        .select('id')
        .eq('challenge_id', challenge.id)
        .eq('user_id', user.id)
        .eq('is_completed', true);
      
      const totalCompletions = totalCompletionsData ? totalCompletionsData.length : 0;
      
      setUserChallengeId(data.id);
      setProgressData({
        daysCompleted: completions?.length || 0,
        startDate: data.start_date,
        isCompleted: data.is_completed || false,
        totalCompletions
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className={`h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 ${isLocked ? 'opacity-50' : ''}`}>
        <CardHeader>
          <ChallengeHeader
            title={challenge.title}
            difficulty={challenge.difficulty}
            category={challenge.category}
            rewardPoints={challenge.reward_points}
            isHovered={isHovered}
            sequenceOrder={sequenceOrder}
            completionCount={progressData.totalCompletions}
          />
        </CardHeader>
        <CardContent className="space-y-3">
          <ChallengeContent
            description={challenge.description}
            motivationText={challenge.motivation_text}
            completionCriteria={challenge.completion_criteria}
            tips={challenge.tips}
            isHovered={isHovered}
          />
          
          {isJoined && userChallengeId && (
            <ChallengeProgressSection
              daysCompleted={progressData.daysCompleted}
              totalDays={challenge.duration_days}
              startDate={progressData.startDate}
              userChallengeId={userChallengeId}
              challengeId={challenge.id}
              onProgressUpdate={fetchProgress}
              rewardPoints={challenge.reward_points}
              isCompleted={progressData.isCompleted}
              totalCompletions={progressData.totalCompletions}
            />
          )}
        </CardContent>
        <CardFooter>
          <ChallengeActions
            isJoined={isJoined}
            isLoading={false}
            onJoin={() => onJoin(challenge.id)}
            difficulty={challenge.difficulty}
            userPoints={userPoints}
            canAccessDifficulty={canAccessDifficulty}
            isLocked={isLocked}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
