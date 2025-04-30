
import { Badge } from "@/components/ui/badge";
import { Brain, Dumbbell, Flame, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeHeaderProps {
  title: string;
  difficulty: string;
  category: string | null;
  rewardPoints: number | null;
  isHovered: boolean;
  sequenceOrder: number;
  completionCount?: number;
}

export function ChallengeHeader({ 
  title, 
  difficulty, 
  category, 
  rewardPoints,
  isHovered,
  sequenceOrder,
  completionCount = 0
}: ChallengeHeaderProps) {
  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'master': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return <Flame className="h-3 w-3" />;
      case 'medium': return <Flame className="h-3 w-3" />;
      case 'hard': return <Flame className="h-3 w-3" />;
      case 'master': return <Star className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const getCategoryIcon = () => {
    switch (category?.toLowerCase()) {
      case 'fitness': return <Dumbbell className="h-3 w-3" />;
      case 'mindfulness': return <Brain className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900 mr-2">
          {title}
          {completionCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
              className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"
            >
              <Trophy className="h-3 w-3 mr-1" /> 
              {completionCount}x
            </motion.span>
          )}
        </h3>
        
        {rewardPoints && rewardPoints > 0 && (
          <motion.div
            initial={isHovered ? { rotate: 0, scale: 1 } : { rotate: 0, scale: 1 }}
            animate={isHovered ? { rotate: [0, -5, 5, -5, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="px-2 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold rounded-md flex items-center gap-1 shadow-md"
          >
            <Star className="h-3 w-3 text-yellow-300" />
            {rewardPoints} pts
          </motion.div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={`${getDifficultyColor()} text-white text-xs px-2 py-0.5 flex items-center gap-1`}>
          {getDifficultyIcon()}
          <span className="capitalize">{difficulty}</span>
        </Badge>
        
        {category && (
          <Badge variant="outline" className="bg-blue-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
            {getCategoryIcon()}
            <span className="capitalize">{category}</span>
          </Badge>
        )}
        
        <Badge variant="outline" className="bg-gray-500 text-white text-xs px-2 py-0.5">
          #{sequenceOrder}
        </Badge>
      </div>
    </div>
  );
}
