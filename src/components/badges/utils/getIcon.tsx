
import { Trophy, Star, Award, Flame, Crown } from "lucide-react";

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Trophy':
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 'Flame':
      return <Flame className="h-6 w-6 text-orange-500" />;
    case 'Star':
      return <Star className="h-6 w-6 text-blue-500" />;
    case 'Award':
      return <Award className="h-6 w-6 text-purple-500" />;
    case 'Crown':
      return <Crown className="h-6 w-6 text-amber-500" />;
    default:
      return <Star className="h-6 w-6 text-gray-500" />;
  }
};
