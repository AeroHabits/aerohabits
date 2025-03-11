
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorTracking } from "@/hooks/useErrorTracking";

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
  
  // Check if the user is on iOS - using a TypeScript-safe approach
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

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
          window.location.href = portalData.url;
        } else {
          throw new Error("No portal URL returned from server");
        }
        return;
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
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      trackError(error, 'creating checkout session', { 
        severity: 'medium',
        context: { profile }
      });
      toast.error('Something went wrong. Please try again.');
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
        window.location.href = data.url;
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
