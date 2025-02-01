import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

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

  const handleJoinChallenge = async () => {
    if (challenge.is_premium) {
      toast.error("This is a premium challenge. Premium features coming soon!");
      return;
    }
    
    setIsLoading(true);
    try {
      onJoin(challenge.id);
      toast.success("Successfully joined the challenge!");
    } catch (error) {
      toast.error("Failed to join the challenge");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">{challenge.title}</CardTitle>
            <div className="flex items-center gap-2">
              {challenge.reward_points && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
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
            <Badge variant="secondary" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            {challenge.category && (
              <Badge variant="outline">
                {challenge.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{challenge.description}</p>
          {challenge.motivation_text && (
            <p className="italic text-sm text-primary">{challenge.motivation_text}</p>
          )}
          <div className="space-y-2">
            {challenge.completion_criteria && (
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                <span>{challenge.completion_criteria}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{challenge.duration_days} days</span>
            </div>
          </div>
          {challenge.tips && challenge.tips.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold">Tips for Success:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {challenge.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
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
              'Already Joined'
            ) : (
              'Join Challenge'
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}