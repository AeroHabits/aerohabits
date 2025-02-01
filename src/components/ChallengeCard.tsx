import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Lock, Sparkles, CheckCircle2, Flame, Star, Award, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      const startDate = new Date(data.start_date);
      const currentDate = new Date();
      const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      setProgressData({
        daysCompleted: Math.min(daysDiff + 1, challenge.duration_days),
        startDate: data.start_date,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return <Star className="h-3 w-3 mr-1" />;
      case 'medium':
        return <Flame className="h-3 w-3 mr-1" />;
      case 'hard':
        return <Award className="h-3 w-3 mr-1" />;
      default:
        return null;
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

  const progressValue = (progressData.daysCompleted / challenge.duration_days) * 100;
  const daysRemaining = challenge.duration_days - progressData.daysCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardTitle className="text-xl font-bold">{challenge.title}</CardTitle>
            </motion.div>
            <div className="flex items-center gap-2">
              {challenge.reward_points && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 animate-pulse">
                  <Trophy className="h-3 w-3 mr-1" />
                  {challenge.reward_points} pts
                </Badge>
              )}
              {challenge.is_premium && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className={`${getDifficultyColor(challenge.difficulty)} flex items-center`}>
              {getDifficultyIcon(challenge.difficulty)}
              {challenge.difficulty}
            </Badge>
            {challenge.category && (
              <Badge variant="outline" className="bg-white/50">
                {challenge.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{challenge.description}</p>
          
          {isJoined && progressData.startDate && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Day {progressData.daysCompleted} of {challenge.duration_days}
                </span>
                <span>{Math.round(progressValue)}% Complete</span>
              </div>
              <Progress value={progressValue} className="h-2" />
              {daysRemaining > 0 ? (
                <p className="text-sm text-blue-600">
                  {daysRemaining} days remaining to complete this challenge!
                </p>
              ) : (
                <p className="text-sm text-green-600 font-medium">
                  Challenge completed! 🎉
                </p>
              )}
            </div>
          )}

          {challenge.motivation_text && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              className="p-3 bg-primary/5 rounded-lg border border-primary/10"
            >
              <p className="italic text-sm text-primary">{challenge.motivation_text}</p>
            </motion.div>
          )}

          {challenge.completion_criteria && (
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
              <span>{challenge.completion_criteria}</span>
            </div>
          )}
          {challenge.tips && challenge.tips.length > 0 && (
            <motion.div 
              initial={{ height: "0px", opacity: 0 }}
              animate={{ height: isHovered ? "auto" : "0px", opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2 bg-blue-50/50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-700">Tips for Success:</h4>
                <ul className="text-sm text-blue-600/80 space-y-1">
                  {challenge.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className={`w-full transition-all duration-300 ${
              isJoined 
                ? 'bg-green-500 hover:bg-green-600' 
                : challenge.is_premium 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : ''
            }`}
            onClick={handleJoinChallenge}
            disabled={isLoading || isJoined}
            variant={challenge.is_premium ? "secondary" : "default"}
          >
            {challenge.is_premium ? (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Premium Challenge</span>
              </div>
            ) : isJoined ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Challenge Accepted!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span>Accept Challenge</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
