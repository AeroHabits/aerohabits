
import { Crown, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";

export function SubscriptionCard() {
  const [isLoading, setIsLoading] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    retry: false,
    staleTime: 0 // Don't cache this data
  });

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-customer-portal', {
        body: { returnUrl: window.location.origin + '/settings' }
      });

      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Could not open subscription settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (profileLoading) return 'Loading...';
    if (!profile?.is_subscribed) return 'Free Plan';
    return profile.subscription_status === 'active' 
      ? 'Premium Active' 
      : profile.subscription_status;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
      <CardHeader className="border-b border-white/10 relative">
        <div className="absolute top-0 right-0 h-20 w-20 opacity-30 pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          AeroHabits Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <h3 className="text-sm font-medium text-gray-200">
            Status: {getSubscriptionStatus()}
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          {profile?.is_subscribed 
            ? "Manage your subscription, view payment history, and update payment method."
            : "Unlock premium features, detailed insights, and personalized tracking"}
        </p>
        {profile?.is_subscribed ? (
          <Button 
            onClick={handleManageSubscription}
            disabled={isLoading}
            variant="premium"
            className="w-full font-medium shadow-lg"
          >
            {isLoading ? "Loading..." : "Manage Subscription"}
          </Button>
        ) : (
          <Button
            onClick={() => window.location.href = '/premium'}
            variant="premium"
            className="w-full font-medium shadow-lg"
          >
            Get Premium
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
