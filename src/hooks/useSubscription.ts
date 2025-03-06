
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useErrorTracking } from "@/hooks/useErrorTracking";

interface ProfileData {
  is_subscribed: boolean | null;
  subscription_status: string | null;
  current_period_end: string | null;
}

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { trackError } = useErrorTracking();
  
  // Check if the user is on iOS - using a TypeScript-safe approach
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  const {
    data: profile,
    isLoading: profileLoading,
    refetch
  } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: { user }
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

  const getSubscriptionStatus = () => {
    if (profileLoading) return 'Loading...';
    if (!profile?.is_subscribed) return 'Free Plan';
    
    if (profile.subscription_status === 'active') return 'Premium Active';
    return profile.subscription_status;
  };

  const syncSubscription = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // For iOS devices, inform the user about App Store subscriptions
      if (isIOS) {
        toast.info("Please subscribe via the App Store on iOS devices");
        return true; // Return true to indicate we should show the App Store info
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
      return false; // Success, no need to show App Store info
    } catch (error) {
      console.error('Error starting subscription:', error);
      trackError(error, 'starting subscription', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Failed to start subscription. Please try again.');
      
      // Show App Store instructions as fallback on iOS
      if (isIOS) {
        return true; // Return true to indicate we should show the App Store info
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    // For iOS devices, show App Store instructions
    if (isIOS) {
      return true; // Return true to indicate we should show the App Store info
    }
    
    try {
      setIsLoading(true);
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
      return false; // Success, no need to show App Store info
    } catch (error) {
      console.error('Error opening customer portal:', error);
      trackError(error, 'opening customer portal', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Failed to open subscription management. Please try again.');
      
      // Show App Store instructions as fallback
      return true; // Return true to indicate we should show the App Store info
    } finally {
      setIsLoading(false);
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

  return {
    profile,
    isLoading,
    isRestoring,
    profileLoading,
    isIOS,
    getSubscriptionStatus,
    handleSubscribe,
    handleManageSubscription,
    handleRestorePurchases,
    syncSubscription
  };
}
