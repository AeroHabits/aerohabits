
import { motion } from "framer-motion";
import { Award, Lock, Star, Trophy } from "lucide-react";

interface DisplayBadgeProps {
  badge: {
    id: string;
    name: string;
    description: string;
    badge_type: string;
    isUnlocked: boolean;
    unlockMessage: string;
    points_required?: number;
  };
  index: number;
}

export function DisplayBadge({ badge, index }: DisplayBadgeProps) {
  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'beginner':
        return <Star className="h-6 w-6 text-blue-500" />;
      case 'expert':
        return <Award className="h-6 w-6 text-purple-500" />;
      case 'master':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      default:
        return <Star className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <motion.div
      key={badge.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative group rounded-lg transition-all duration-300 ${
        badge.isUnlocked 
          ? 'bg-white/10' 
          : 'bg-white/5'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${
            badge.isUnlocked 
              ? 'bg-white/10' 
              : 'bg-white/5'
          }`}>
            {badge.isUnlocked 
              ? getBadgeIcon(badge.badge_type)
              : <Lock className="h-6 w-6 text-white/50" />
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{badge.name}</span>
              {'points_required' in badge && !badge.isUnlocked && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {badge.points_required} pts needed
                </span>
              )}
            </div>
            <p className="text-sm text-white/70">{badge.description}</p>
          </div>
        </div>
      </div>
      {badge.isUnlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
            {badge.unlockMessage}
          </span>
        </div>
      )}
    </motion.div>
  );
}
