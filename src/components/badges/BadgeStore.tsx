
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Award, Flame, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const BadgeTypeContent = ({ 
  badges, 
  purchasedBadges, 
  onPurchase 
}: { 
  badges: StoreBadge[], 
  purchasedBadges: PurchasedBadge[] | undefined,
  onPurchase: (badgeId: string) => void 
}) => {
  const isOwned = (badgeId: string) => {
    return purchasedBadges?.some(pb => pb.badge_id === badgeId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge, index) => (
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
                      onClick={() => onPurchase(badge.id)}
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
  );
};

export function BadgeStore() {
  const { data: badges, isLoading: isLoadingBadges, error: badgesError, refetch: refetchBadges } = useQuery({
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

  const { data: purchasedBadges, isLoading: isLoadingPurchased, error: purchasedError, refetch: refetchPurchased } = useQuery({
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

  const handlePurchase = async (badgeId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('purchase_badge', { badge_id: badgeId });

      if (error) throw error;

      const response = data as unknown as PurchaseResponse;
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      refetchPurchased();
    } catch (error) {
      toast.error("Failed to purchase badge. Please try again.");
    }
  };

  const handleRetry = () => {
    refetchBadges();
    refetchPurchased();
  };

  if (badgesError || purchasedError) {
    return (
      <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading badge store</AlertTitle>
        <AlertDescription>
          There was a problem loading the badge store. Please try again.
        </AlertDescription>
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          className="mt-4 bg-white/10 hover:bg-white/20 border-white/20"
        >
          Try Again
        </Button>
      </Alert>
    );
  }

  if (isLoadingBadges || isLoadingPurchased) {
    return (
      <div className="text-center py-8 text-white/60">
        Loading badge store...
      </div>
    );
  }

  const beginnerBadges = badges?.filter(b => b.badge_type === 'beginner') || [];
  const expertBadges = badges?.filter(b => b.badge_type === 'expert') || [];
  const masterBadges = badges?.filter(b => b.badge_type === 'master') || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="beginner" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="expert">Expert</TabsTrigger>
          <TabsTrigger value="master">Master</TabsTrigger>
        </TabsList>
        
        <TabsContent value="beginner" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Beginner Badges</h3>
            <p className="text-sm text-white/70">Perfect for starting your journey!</p>
          </div>
          <BadgeTypeContent 
            badges={beginnerBadges} 
            purchasedBadges={purchasedBadges} 
            onPurchase={handlePurchase} 
          />
        </TabsContent>

        <TabsContent value="expert" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Expert Badges</h3>
            <p className="text-sm text-white/70">Show your dedication and skill!</p>
          </div>
          <BadgeTypeContent 
            badges={expertBadges} 
            purchasedBadges={purchasedBadges} 
            onPurchase={handlePurchase} 
          />
        </TabsContent>

        <TabsContent value="master" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Master Badges</h3>
            <p className="text-sm text-white/70">Elite badges for true masters!</p>
          </div>
          <BadgeTypeContent 
            badges={masterBadges} 
            purchasedBadges={purchasedBadges} 
            onPurchase={handlePurchase} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
