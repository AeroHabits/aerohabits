
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { StoreBadge, PurchasedBadge, PurchaseResponse } from "./types";
import { BadgeTypeContent } from "./BadgeTypeContent";

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
