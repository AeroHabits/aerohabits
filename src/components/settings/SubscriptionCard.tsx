
import { Crown, Timer, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export function SubscriptionCard() {
  const [loading, setLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return data;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return data;
    },
  });

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) {
      toast.error("No active subscription found");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke(
        'create-customer-portal',
        {
          body: {
            customerId: subscription.stripe_customer_id,
          },
        }
      );

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast.error(error.message || "Failed to open customer portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Subscription</CardTitle>
        <CardDescription className="text-gray-300">
          {profile?.is_premium ? "Manage your premium subscription" : "Upgrade to premium for full access"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <h3 className="font-medium text-white">
                {profile?.is_premium ? "Premium Plan" : "Free Plan"}
              </h3>
              {subscription?.status === 'trialing' && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                  <Timer className="w-3 h-3 mr-1" />
                  Trial
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-300">
              {profile?.is_premium 
                ? "You have access to all premium features"
                : "Upgrade to unlock all premium features"}
            </p>
          </div>
          {profile?.is_premium ? (
            <Button
              onClick={handleManageSubscription}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              {loading ? "Loading..." : (
                <>
                  Manage Subscription
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Upgrade Now
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
