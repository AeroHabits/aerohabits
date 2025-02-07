
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award, Lock, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { PointsGuide } from "./PointsGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeStore } from "./BadgeStore";

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
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Badges & Points Guide</h2>
        </div>

        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">Points Guide</TabsTrigger>
            <TabsTrigger value="badges">Your Badges</TabsTrigger>
            <TabsTrigger value="store">Badge Store</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide" className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-white/80">
                Learn how to earn and use your points to unlock special badges. Complete challenges and maintain streaks to progress!
              </p>
            </div>
            <PointsGuide />
          </TabsContent>
          
          <TabsContent value="badges" className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-white/80">
                Your earned badges are displayed here. Each badge represents a milestone in your journey!
              </p>
            </div>
            <Separator className="bg-white/10 mb-4" />
            
            <div className="space-y-4">
              {badges?.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group rounded-lg transition-all duration-300 ${
                    isUnlocked(badge.id) 
                      ? 'bg-white/10' 
                      : 'bg-white/5'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        isUnlocked(badge.id) 
                          ? 'bg-white/10' 
                          : 'bg-white/5'
                      }`}>
                        {isUnlocked(badge.id) 
                          ? getBadgeIcon(badge.badge_type)
                          : <Lock className="h-6 w-6 text-white/50" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{badge.name}</span>
                          {!isUnlocked(badge.id) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                              {badge.points_required} pts needed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/70">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                  {isUnlocked(badge.id) && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        Unlocked!
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {badges?.length === 0 && (
                <div className="text-center py-8 text-white/60">
                  No badges available yet. Start completing challenges to earn them!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="store" className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-white/80">
                Spend your hard-earned points on exclusive badges. Each badge is unique and shows off your achievements!
              </p>
            </div>
            <Separator className="bg-white/10 mb-4" />
            <BadgeStore />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
