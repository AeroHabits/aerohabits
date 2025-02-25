
import { Crown, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionCardProps {
  isLoading?: boolean;
}

export function SubscriptionCard({ isLoading }: SubscriptionCardProps) {
  const [isLoadingState, setIsLoadingState] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status, trial_end_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleManageSubscription = async () => {
    try {
      setIsLoadingState(true);
      const { data, error } = await supabase.functions.invoke('create-customer-portal', {
        body: { returnUrl: window.location.origin + '/settings' }
      });

      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setIsLoadingState(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (profileLoading) return 'Loading...';
    if (!profile?.is_subscribed) return 'Not subscribed';
    if (profile.subscription_status === 'trialing') return 'Trial Active';
    return profile.subscription_status === 'active' 
      ? 'Active' 
      : profile.subscription_status;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg font-medium text-white">
          Premium Monthly
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <h3 className="text-sm font-medium text-gray-200">
            Subscription Status: {getSubscriptionStatus()}
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">$9.99</span>
          <span className="text-sm text-gray-400">/month</span>
        </div>

        {profile?.subscription_status === 'trialing' && (
          <Alert className="bg-red-500/20 border-red-500/30 text-white">
            <Calendar className="h-4 w-4" />
            <AlertDescription className="text-white">
              Important: After your 3-day trial, you'll need to subscribe to continue using the app. You will be charged $9.99/month.
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-gray-400">
          {profile?.is_subscribed 
            ? "Manage your subscription, view billing history, and update payment methods."
            : "Start with a 3-day free trial. After the trial period, subscribe to continue using all app features."}
        </p>

        {profile?.is_subscribed ? (
          <Button 
            onClick={handleManageSubscription}
            disabled={isLoading || isLoadingState}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg"
          >
            {isLoading || isLoadingState ? "Loading..." : "Manage Subscription"}
          </Button>
        ) : (
          <Button
            onClick={() => window.location.href = '/premium'}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg"
          >
            {isLoading ? "Loading..." : "Start 3-Day Free Trial"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
