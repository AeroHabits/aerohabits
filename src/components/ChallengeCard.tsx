import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeHeader } from "./challenge/ChallengeHeader";
import { ChallengeProgress } from "./challenge/ChallengeProgress";
import { ChallengeTips } from "./challenge/ChallengeTips";
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
    is_premium: boolean | null;
    completion_criteria: string | null;
    motivation_text: string | null;
    milestones: any[] | null;
    tips: string[] | null;
  };
  onJoin: (challengeId: string) => void;
  isJoined?: boolean;
}

export function ChallengeCard({ challenge, onJoin, isJoined }: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [userChallengeId, setUserChallengeId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<{
    daysCompleted: number;
    startDate: string | null;
  }>({
    daysCompleted: 0,
    startDate: null,
  });

  useEffect(() => {
    if (isJoined) {
      fetchProgress();
    }
  }, [isJoined, challenge.id]);

  const fetchProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('challenge_id', challenge.id)
      .eq('user_id', user.id)
      .single();

    if (data) {
      const { data: completions } = await supabase
        .from('challenge_completions')
        .select('*')
        .eq('user_challenge_id', data.id);

      setUserChallengeId(data.id);
      setProgressData({
        daysCompleted: completions?.length || 0,
        startDate: data.start_date,
      });
    }
  };

  const handleJoinChallenge = async () => {
    if (challenge.is_premium) {
      toast.error("This is a premium challenge. Premium features coming soon!");
      return;
    }
    
    setIsLoading(true);
    try {
      onJoin(challenge.id);
      toast.success("Successfully joined the challenge! Let's crush this goal together! 💪");
    } catch (error) {
      toast.error("Failed to join the challenge");
    } finally {
      setIsLoading(false);
    }
  };

  const getPointsMessage = () => {
    if (!challenge.reward_points) return null;
    if (progressData.daysCompleted === challenge.duration_days) {
      return `You've earned ${challenge.reward_points} points for completing this challenge!`;
    }
    return `Complete all ${challenge.duration_days} days to earn ${challenge.reward_points} points!`;
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
      <Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <ChallengeHeader
            title={challenge.title}
            difficulty={challenge.difficulty}
            category={challenge.category}
            rewardPoints={challenge.reward_points}
            isPremium={challenge.is_premium}
            isHovered={isHovered}
          />
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
          
          {isJoined && userChallengeId && (
            <>
              <ChallengeProgress
                daysCompleted={progressData.daysCompleted}
                totalDays={challenge.duration_days}
                startDate={progressData.startDate}
                userChallengeId={userChallengeId}
                onProgressUpdate={fetchProgress}
              />
              {challenge.reward_points && (
                <p className="text-sm font-medium text-primary">
                  {getPointsMessage()}
                </p>
              )}
            </>
          )}

          {challenge.motivation_text && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              className="p-2 bg-primary/5 rounded-lg border border-primary/10"
            >
              <p className="italic text-xs text-primary line-clamp-2">{challenge.motivation_text}</p>
            </motion.div>
          )}

          {challenge.completion_criteria && (
            <div className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
              <span className="line-clamp-2">{challenge.completion_criteria}</span>
            </div>
          )}

          {challenge.tips && isHovered && (
            <ChallengeTips tips={challenge.tips} isHovered={isHovered} />
          )}
        </CardContent>
        <CardFooter>
          <ChallengeActions
            isPremium={challenge.is_premium}
            isJoined={isJoined}
            isLoading={isLoading}
            onJoin={handleJoinChallenge}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
}