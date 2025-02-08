
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const useBadges = () => {
  const { data: badges, isLoading: isLoadingBadges, error: badgesError, refetch: refetchBadges } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("points_required", { ascending: true });

      if (error) {
        toast.error("Failed to load achievements");
        throw error;
      }
      return data as Badge[];
    },
  });

  const { data: userBadges, isLoading: isLoadingUserBadges, error: userBadgesError, refetch: refetchUserBadges } = useQuery({
    queryKey: ["user-badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to load user achievements");
        throw error;
      }
      return data as UserBadge[];
    },
  });

  const { data: purchasedBadges, isLoading: isLoadingPurchased, error: purchasedError, refetch: refetchPurchased } = useQuery({
    queryKey: ["purchased-badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

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

      if (error) {
        toast.error("Failed to load purchased badges");
        throw error;
      }
      return data as PurchasedBadge[];
    },
  });

  const isUnlocked = (badgeId: string) => {
    return userBadges?.some(ub => ub.achievement_id === badgeId) ?? false;
  };

  const isLoading = isLoadingBadges || isLoadingUserBadges || isLoadingPurchased;
  const error = badgesError || userBadgesError || purchasedError;

  const combinedBadges = !isLoading && !error ? [
    ...(badges?.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      badge_type: badge.badge_type,
      isUnlocked: isUnlocked(badge.id),
      unlockMessage: 'Unlocked!',
      points_required: badge.points_required
    })) ?? []),
    ...(purchasedBadges?.filter(pb => pb.badge != null).map(pb => ({
      id: pb.badge.id,
      name: pb.badge.name,
      description: pb.badge.description,
      badge_type: pb.badge.badge_type,
      isUnlocked: true,
      unlockMessage: 'Purchased!'
    })) ?? [])
  ] : [];

  const refetchAll = () => {
    refetchBadges();
    refetchUserBadges();
    refetchPurchased();
  };

  return {
    badges: combinedBadges,
    isLoading,
    error,
    refetchAll
  };
};
