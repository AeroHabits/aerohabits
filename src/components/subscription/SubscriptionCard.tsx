import { Crown, Calendar, Sparkles, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { AppleSubscriptionInfo } from "./AppleSubscriptionInfo";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubscriptionCardProps {
  isLoading?: boolean;
}

interface ProfileData {
  is_subscribed: boolean | null;
  subscription_status: string | null;
  current_period_end: string | null;
}

export function SubscriptionCard({
  isLoading
}: SubscriptionCardProps) {
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { trackError } = useErrorTracking();
  const [showAppStoreInfo, setShowAppStoreInfo] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch
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
      } = await supabase.from('profiles').select('is_subscribed, subscription_status, current_period_end').eq('id', user.id).single();
      if (error) throw error;
      return data;
    },
    retry: false,
    staleTime: 0 // Don't cache this data
  });

  // Check if the user is on iOS - using a TypeScript-safe approach
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  const handleSubscribe = async () => {
    try {
      setIsLoadingState(true);
      
      // For iOS devices, inform the user about App Store subscriptions
      if (isIOS) {
        toast.info("Please subscribe via the App Store on iOS devices");
        setShowAppStoreInfo(true);
        return;
      }
      
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
          returnUrl: window.location.origin + '/settings',
          includeTrialPeriod: true // Always include trial period for new subscribers
        }
      });
      
      if (error) throw error;
      window.location.href = data.url;
    } catch (error) {
      console.error('Error starting subscription:', error);
      trackError(error, 'starting subscription', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Failed to start subscription. Please try again.');
      
      // Show App Store instructions as fallback on iOS
      if (isIOS) {
        setShowAppStoreInfo(true);
      }
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleManageSubscription = async () => {
    // For iOS devices, show App Store instructions
    if (isIOS) {
      setShowAppStoreInfo(true);
      return;
    }
    
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
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        // Fallback if no URL is returned
        throw new Error("No portal URL returned from server");
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      trackError(error, 'opening customer portal', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Failed to open subscription management. Please try again.');
      
      // Show App Store instructions as fallback
      setShowAppStoreInfo(true);
    } finally {
      setIsLoadingState(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (profileLoading) return 'Loading...';
    if (!profile?.is_subscribed) return 'Free Plan';
    
    if (profile.subscription_status === 'active') return 'Premium Active';
    return profile.subscription_status;
  };

  const getNextBillingDate = () => {
    if (!profile?.current_period_end) return null;
    return format(new Date(profile.current_period_end), 'MMMM d, yyyy');
  };

  const syncSubscription = async () => {
    try {
      setIsLoadingState(true);
      toast.info("Checking subscription status with Stripe...");
      
      const { data, error } = await supabase.functions.invoke('sync-subscription', {
        body: {}
      });
      
      if (error) throw error;
      
      await refetch();
      
      if (data?.updated) {
        toast.success("Subscription status updated successfully");
        if (data?.status === 'active') {
          toast.success("Your subscription is now active! Thank you for subscribing.");
        }
      } else {
        toast.info("No changes to subscription status");
      }
    } catch (error) {
      console.error('Error syncing subscription:', error);
      trackError(error, 'syncing subscription', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Failed to sync subscription status. Please try again.');
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      toast.info("Restoring your purchases...");
      
      // For iOS devices
      if (isIOS) {
        // On iOS, this would integrate with native StoreKit
        // For web, we redirect to App Store
        window.location.href = "https://apps.apple.com/account/subscriptions";
        return;
      }
      
      // For web/other platforms, sync with backend
      const { data, error } = await supabase.functions.invoke('sync-subscription', {
        body: { restore: true }
      });
      
      if (error) throw error;
      
      await refetch();
      
      if (data?.restored) {
        toast.success("Your purchases have been restored successfully!");
      } else {
        toast.info("No previous purchases found to restore.");
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      trackError(error, 'restoring purchases', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <motion.div 
          className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }} 
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <CardHeader className="border-b border-gray-700/50 relative">
          <CardTitle className="text-2xl font-normal text-white flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            AeroHabits Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 relative">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-400 animate-glow" />
            <h3 className="text-lg font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Status: {getSubscriptionStatus()}
            </h3>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-bold bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent text-5xl">
              $9.99
            </span>
            <span className="text-gray-400 text-xl">/month</span>
          </div>

          {profile?.is_subscribed && profile?.subscription_status === 'active' && profile?.current_period_end && (
            <Alert className="bg-green-900/40 border border-green-500/30 backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-green-400" />
              <AlertDescription className="text-white text-base">
                Your next payment is on {getNextBillingDate()}
              </AlertDescription>
            </Alert>
          )}

          <p className="text-gray-400 text-lg leading-relaxed">
            {profile?.is_subscribed 
              ? "Manage your subscription, view payment history, and update payment methods."
              : "Start your 3-day free trial today. Your card will be charged automatically after the trial period."
            }
          </p>

          {profile?.is_subscribed ? (
            <Button
              onClick={handleManageSubscription}
              disabled={isLoading || isLoadingState}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] animate-shimmer" />
              {isLoading || isLoadingState ? "Loading..." : "Manage Subscription"}
            </Button>
          ) : (
            <Button
              onClick={handleSubscribe}
              disabled={isLoading || isLoadingState}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-shimmer" />
              {isLoading || isLoadingState ? "Loading..." : "Start 3-Day Free Trial"}
            </Button>
          )}
          
          {/* Add Restore Purchases button - Apple requirement */}
          <Button
            onClick={handleRestorePurchases}
            disabled={isRestoring}
            variant="ghost"
            className="w-full font-medium text-gray-400 hover:text-gray-200 border border-gray-700/50 py-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRestoring ? 'animate-spin' : ''}`} />
            {isRestoring ? "Restoring..." : "Restore Purchases"}
          </Button>
          
          {/* Added Apple-specific subscription information for App Store compliance */}
          <AppleSubscriptionInfo />
        </CardContent>
      </Card>

      <AlertDialog open={showAppStoreInfo} onOpenChange={setShowAppStoreInfo}>
        <AlertDialogContent className="bg-gray-900 border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {profile?.is_subscribed ? "Manage Your Subscription" : "Subscribe via App Store"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {profile?.is_subscribed 
                ? "To manage your subscription on iOS devices, please follow these steps:" 
                : "To subscribe to AeroHabits Premium on iOS devices:"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2 text-gray-300">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Open the <span className="font-medium text-white">Settings</span> app on your iOS device</li>
              <li>Tap your <span className="font-medium text-white">Apple ID</span> at the top of the screen</li>
              <li>Select <span className="font-medium text-white">Subscriptions</span></li>
              {profile?.is_subscribed ? (
                <>
                  <li>Find and tap <span className="font-medium text-white">AeroHabits</span> in your list of subscriptions</li>
                  <li>Here you can manage, cancel, or change your subscription options</li>
                </>
              ) : (
                <>
                  <li>Tap <span className="font-medium text-white">+ Subscribe to a new service</span></li>
                  <li>Find and select <span className="font-medium text-white">AeroHabits</span></li>
                  <li>Choose the subscription plan that suits you</li>
                </>
              )}
            </ol>
            <div className="pt-2">
              <p className="text-sm text-gray-400 flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" />
                You'll be redirected to Apple's subscription management
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
              onClick={() => {
                // Open iOS subscription settings
                window.location.href = "https://apps.apple.com/account/subscriptions";
              }}
            >
              Open App Store
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
