import { Crown, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { format } from "date-fns";
interface SubscriptionCardProps {
  isLoading?: boolean;
}
interface ProfileData {
  is_subscribed: boolean | null;
  subscription_status: string | null;
  trial_end_date: string | null;
  current_period_end: string | null;
}
export function SubscriptionCard({
  isLoading
}: SubscriptionCardProps) {
  const [isLoadingState, setIsLoadingState] = useState(false);
  const {
    data: profile,
    isLoading: profileLoading
  } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const {
        data,
        error
      } = await supabase.from('profiles').select('is_subscribed, subscription_status, trial_end_date, current_period_end').eq('id', user.id).single();
      if (error) throw error;
      return data;
    }
  });
  const handleManageSubscription = async () => {
    try {
      setIsLoadingState(true);
      const {
        data,
        error
      } = await supabase.functions.invoke('create-customer-portal', {
        body: {
          returnUrl: window.location.origin + '/settings'
        }
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
    return profile.subscription_status === 'active' ? 'Active' : profile.subscription_status;
  };
  const getNextBillingDate = () => {
    if (!profile?.current_period_end) return null;
    return format(new Date(profile.current_period_end), 'MMMM d, yyyy');
  };
  return <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <motion.div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3]
    }} transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }} />
      <CardHeader className="border-b border-gray-700/50 relative">
        <CardTitle className="text-2xl font-normal text-white flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          Premium Monthly
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 relative">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-400 animate-glow" />
          <h3 className="text-lg font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Subscription Status: {getSubscriptionStatus()}
          </h3>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-bold bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent text-4xl">
            $9.99
          </span>
          <span className="text-gray-400 text-xl">/month</span>
        </div>

        {profile?.subscription_status === 'trialing' && <Alert className="bg-red-900/40 border border-red-500/30 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-red-400" />
            <AlertDescription className="text-white text-base">
              Important: After your 3-day trial, you will be charged $9.99/month.
            </AlertDescription>
          </Alert>}

        {profile?.is_subscribed && profile?.current_period_end && <Alert className="bg-blue-900/40 border border-blue-500/30 backdrop-blur-sm">
            <Calendar className="h-5 w-5 text-blue-400" />
            <AlertDescription className="text-white text-base">
              Your next billing date is {getNextBillingDate()}
            </AlertDescription>
          </Alert>}

        <p className="text-gray-400 text-lg leading-relaxed">
          {profile?.is_subscribed ? "Manage your subscription, view billing history, and update payment methods." : "Subscribe now to continue using all premium features after your trial period ends."}
        </p>

        {profile?.is_subscribed ? <Button onClick={handleManageSubscription} disabled={isLoading || isLoadingState} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] animate-shimmer" />
            {isLoading || isLoadingState ? "Loading..." : "Manage Subscription"}
          </Button> : <Button onClick={() => window.location.href = '/premium'} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-shimmer" />
            Subscribe Now
          </Button>}
      </CardContent>
    </Card>;
}