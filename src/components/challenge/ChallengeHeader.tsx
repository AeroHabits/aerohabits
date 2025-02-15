
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { Trophy, Sparkles, Star, Flame, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeHeaderProps {
  title: string;
  difficulty: string;
  category: string | null;
  rewardPoints: number | null;
  isPremium: boolean | null;
  isHovered: boolean;
  sequenceOrder: number;
}

export function ChallengeHeader({
  title,
  difficulty,
  category,
  rewardPoints,
  isPremium,
  isHovered,
  sequenceOrder
}: ChallengeHeaderProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      case 'master':
        return 'bg-purple-100 text-purple-800';
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
      case 'master':
        return <Crown className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">#{sequenceOrder}</span>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </motion.div>
        <div className="flex items-center gap-2">
          {rewardPoints && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 animate-pulse">
              <Trophy className="h-3 w-3 mr-1" />
              {rewardPoints} pts
            </Badge>
          )}
          {isPremium && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant="secondary" className={`${getDifficultyColor(difficulty)} flex items-center`}>
          {getDifficultyIcon(difficulty)}
          {difficulty}
        </Badge>
        {category && (
          <Badge variant="outline" className="bg-white/50">
            {category}
          </Badge>
        )}
      </div>
    </div>
  );
}
