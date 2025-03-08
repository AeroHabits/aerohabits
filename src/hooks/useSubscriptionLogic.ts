import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export function useSubscriptionLogic(setIsLoading: (loading: boolean) => void) {
  const { trackError } = useErrorTracking();
  
  // Get user's subscription status
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['subscription-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, is_subscribed, subscription_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    retry: false,
    staleTime: 0 // Don't cache this data
  });

  const hasActiveSubscription = profile?.is_subscribed || profile?.subscription_status === 'active';
  
  // Check if we're on iOS - both real device and simulator
  const isIOS = Capacitor.getPlatform() === 'ios';

  // Helper to safely open URLs in Capacitor
  const safeOpenUrl = async (url: string) => {
    if (isIOS) {
      try {
        // Handle browser closing by reloading the app to refresh state
        const listener = await Browser.addListener('browserFinished', () => {
          window.location.reload();
        });
        
        // Open in in-app browser
        await Browser.open({ url, presentationStyle: 'popover' });
        
        // Return true to indicate browser was opened
        return true;
      } catch (error) {
        console.error('Error opening browser:', error);
        // Fallback to regular navigation if browser plugin fails
        window.location.href = url;
        return true;
      }
    } else {
      // For non-iOS, just navigate directly
      window.location.href = url;
      return false;
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // Check if user already has an active subscription
      if (hasActiveSubscription) {
        // Redirect to customer portal instead of creating a new subscription
        const { data: portalData, error: portalError } = await supabase.functions.invoke('create-customer-portal', {
          body: { returnUrl: window.location.origin + '/settings' }
        });
        
        if (portalError) throw portalError;
        
        if (portalData?.url) {
          const isBrowserOpened = await safeOpenUrl(portalData.url);
          return isBrowserOpened;
        } else {
          throw new Error("No portal URL returned from server");
        }
      }
      
      // Create a new subscription with trial period
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
          returnUrl: window.location.origin + '/settings',
          includeTrialPeriod: true
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const isBrowserOpened = await safeOpenUrl(data.url);
        return isBrowserOpened;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      trackError(error, 'creating checkout session', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Something went wrong. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-customer-portal', {
        body: { returnUrl: window.location.origin + '/settings' }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const isBrowserOpened = await safeOpenUrl(data.url);
        return isBrowserOpened;
      } else {
        throw new Error("No portal URL returned from server");
      }
    } catch (error) {
      console.error('Error creating customer portal:', error);
      trackError(error, 'creating customer portal', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Something went wrong. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isProfileLoading,
    hasActiveSubscription,
    isIOS,
    handleSubscribe,
    handleManageSubscription
  };
}
