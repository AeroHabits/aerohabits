import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target } from "lucide-react";
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
            <Trophy className="h-5 w-5 text-yellow-500" />
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
        <CardContent>
          <p className="text-muted-foreground">{challenge.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{challenge.duration_days} days</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleJoinChallenge}
            disabled={isLoading || isJoined}
          >
            {isJoined ? 'Already Joined' : 'Join Challenge'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}