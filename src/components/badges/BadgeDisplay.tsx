
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface Badge {
  id: string;
  name: string;
  description: string;
  points_required: number;
  badge_type: 'beginner' | 'expert' | 'master';
}

interface UserBadge {
  achievement_id: string;
  unlocked_at: string;
}

export function BadgeDisplay() {
  const { data: badges } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("points_required", { ascending: true });

      if (error) throw error;
      return data as Badge[];
    },
  });

  const { data: userBadges } = useQuery({
    queryKey: ["user-badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as UserBadge[];
    },
  });

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

  const isUnlocked = (badgeId: string) => {
    return userBadges?.some(ub => ub.achievement_id === badgeId);
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Badges
      </h2>
      <div className="space-y-4">
        {badges?.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
              isUnlocked(badge.id) 
                ? 'bg-white/10 hover:bg-white/15' 
                : 'bg-white/5 hover:bg-white/10 opacity-50'
            }`}
          >
            <div className="flex items-center gap-4">
              {getBadgeIcon(badge.badge_type)}
              <div>
                <span className="text-white font-semibold">{badge.name}</span>
                <p className="text-sm text-white/70">{badge.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-white/80 text-sm">
                {isUnlocked(badge.id) 
                  ? 'Unlocked!' 
                  : `${badge.points_required} pts required`}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
