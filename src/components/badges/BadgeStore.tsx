
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Award, Flame, Crown, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StoreBadge {
  id: string;
  name: string;
  description: string;
  cost: number;
  badge_type: 'beginner' | 'expert' | 'master';
  icon: string;
}

interface PurchasedBadge {
  badge_id: string;
}

interface PurchaseResponse {
  success: boolean;
  message: string;
  remaining_points?: number;
}

const getIcon = (iconName: string) => {
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

export function BadgeStore() {
  const { data: badges } = useQuery({
    queryKey: ["badge-store"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badge_store")
        .select("*")
        .order('cost', { ascending: true });

      if (error) throw error;
      return data as StoreBadge[];
    },
  });

  const { data: purchasedBadges, refetch: refetchPurchased } = useQuery({
    queryKey: ["purchased-badges"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("purchased_badges")
        .select("badge_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as PurchasedBadge[];
    },
  });

  const isOwned = (badgeId: string) => {
    return purchasedBadges?.some(pb => pb.badge_id === badgeId);
  };

  const handlePurchase = async (badgeId: string) => {
    const { data, error } = await supabase
      .rpc('purchase_badge', { badge_id: badgeId });

    if (error) {
      toast.error("Failed to purchase badge");
      return;
    }

    const response = data as PurchaseResponse;
    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    refetchPurchased();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges?.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-white/5 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-white/10">
                  {getIcon(badge.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    {badge.name}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                      {badge.cost} pts
                    </span>
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    {badge.description}
                  </p>
                  <div className="mt-3">
                    {isOwned(badge.id) ? (
                      <Button 
                        variant="secondary" 
                        className="w-full" 
                        disabled
                      >
                        Owned
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => handlePurchase(badge.id)}
                      >
                        Purchase
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
