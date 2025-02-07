
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PointsGuide } from "./PointsGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeStore } from "./BadgeStore";
import { BadgesList } from "./BadgesList";

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

interface PurchasedBadge {
  badge_id: string;
  purchased_at: string;
  badge: {
    id: string;
    name: string;
    description: string;
    badge_type: string;
  };
}

export function BadgeDisplay() {
  const { data: badges, isLoading: isLoadingBadges } = useQuery({
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

  const { data: userBadges, isLoading: isLoadingUserBadges } = useQuery({
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

  const { data: purchasedBadges, isLoading: isLoadingPurchased } = useQuery({
    queryKey: ["purchased-badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("purchased_badges")
        .select(`
          badge_id,
          purchased_at,
          badge:badge_store (
            id,
            name,
            description,
            badge_type
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as PurchasedBadge[];
    },
  });

  const isUnlocked = (badgeId: string) => {
    return userBadges?.some(ub => ub.achievement_id === badgeId);
  };

  const isLoading = isLoadingBadges || isLoadingUserBadges || isLoadingPurchased;

  // Only combine badges when all data is loaded
  const allBadges = !isLoading ? [
    ...(badges || []).map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      badge_type: badge.badge_type,
      isUnlocked: isUnlocked(badge.id),
      unlockMessage: 'Unlocked!',
      points_required: badge.points_required
    })),
    ...(purchasedBadges || []).map(pb => ({
      id: pb.badge.id,
      name: pb.badge.name,
      description: pb.badge.description,
      badge_type: pb.badge.badge_type,
      isUnlocked: true,
      unlockMessage: 'Purchased!'
    }))
  ] : [];

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
                Your earned and purchased badges are displayed here. Each badge represents a milestone in your journey!
              </p>
            </div>
            <Separator className="bg-white/10 mb-4" />
            {isLoading ? (
              <div className="text-center py-8 text-white/60">
                Loading badges...
              </div>
            ) : (
              <BadgesList badges={allBadges} />
            )}
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
