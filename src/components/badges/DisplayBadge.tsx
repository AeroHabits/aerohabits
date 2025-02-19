
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
        return <Star className="h-6 w-6 text-blue-400" />;
      case 'expert':
        return <Award className="h-6 w-6 text-[#8B5CF6]" />;
      case 'master':
        return <Trophy className="h-6 w-6 text-amber-400" />;
      default:
        return <Star className="h-6 w-6 text-blue-400" />;
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
          ? 'bg-[#2A2F3C] border-2 border-[#403E43]' 
          : 'bg-[#1A1F2C] border-2 border-[#2A2F3C]'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${
            badge.isUnlocked 
              ? 'bg-[#8B5CF6]/20' 
              : 'bg-gray-700'
          }`}>
            {badge.isUnlocked 
              ? getBadgeIcon(badge.badge_type)
              : <Lock className="h-6 w-6 text-gray-400" />
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{badge.name}</span>
              {'points_required' in badge && !badge.isUnlocked && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6]">
                  {badge.points_required} pts needed
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300">{badge.description}</p>
          </div>
        </div>
      </div>
      {badge.isUnlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 font-medium">
            {badge.unlockMessage}
          </span>
        </div>
      )}
    </motion.div>
  );
}
