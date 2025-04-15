
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("points_required", { ascending: true });

      if (error) {
        console.error("Error fetching badges:", error);
        throw error;
      }
      
      return data as Badge[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: userBadges, isLoading: isLoadingUserBadges, error: userBadgesError, refetch: refetchUserBadges } = useQuery({
    queryKey: ["user-badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found, returning empty array for user badges");
        return []; // Return empty array instead of throwing error
      }

      const { data, error } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user badges:", error);
        throw error;
      }

      console.log("User badges fetched:", data?.length);
      return data as UserBadge[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: Boolean(supabase.auth.getSession()), // Only run query if user is authenticated
  });

  const { data: purchasedBadges, isLoading: isLoadingPurchased, error: purchasedError, refetch: refetchPurchased } = useQuery({
    queryKey: ["purchased-badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found, returning empty array for purchased badges");
        return []; // Return empty array instead of throwing error
      }

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
        console.error("Error fetching purchased badges:", error);
        throw error;
      }

      console.log("Purchased badges fetched:", data?.length);
      return data as PurchasedBadge[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: Boolean(supabase.auth.getSession()), // Only run query if user is authenticated
  });

  const isUnlocked = (badgeId: string) => {
    return userBadges?.some(ub => ub.achievement_id === badgeId) ?? false;
  };

  const isLoading = isLoadingBadges || isLoadingUserBadges || isLoadingPurchased;
  const error = badgesError || userBadgesError || purchasedError;

  // Debug information to help troubleshoot
  console.log('Badges data:', badges?.length);
  console.log('UserBadges data:', userBadges?.length);
  console.log('PurchasedBadges data:', purchasedBadges?.length);

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
      id: pb.badge?.id || `purchased-${pb.badge_id}`,
      name: pb.badge?.name || "Purchased Badge",
      description: pb.badge?.description || "A badge you purchased from the store",
      badge_type: pb.badge?.badge_type || "beginner",
      isUnlocked: true,
      unlockMessage: 'Purchased!'
    })) ?? [])
  ] : [];

  console.log('Combined badges:', combinedBadges?.length);

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
