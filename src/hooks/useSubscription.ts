
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

// Helper function to handle API retries
async function retryApiCall<T>(apiCall: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.error(`API attempt ${attempt}/${maxRetries} failed:`, error);
      lastError = error;
      
      // Check if this is likely a network error or a server error (5xx)
      const isServerError = error.message?.includes('502') || 
                           error.message?.includes('503') || 
                           error.message?.includes('504') ||
                           error.message?.includes('network') ||
                           error.message?.includes('failed to fetch');
      
      if (!isServerError) {
        throw error; // Don't retry on client errors
      }
      
      // Only retry if we haven't reached max retries
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw lastError;
      }
    }
  }
  
  throw lastError; // Should never reach here due to the throw in the loop
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
      try {
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
      } catch (error) {
        // If this fails with a server error, we should still return a default state
        // rather than completely failing the application
        console.error("Error fetching profile:", error);
        
        if (error.message?.includes('502') || 
            error.message?.includes('503') || 
            error.message?.includes('504') ||
            error.message?.includes('network')) {
          // Return a default state for server errors
          return {
            is_subscribed: null,
            subscription_status: "unknown",
            current_period_end: null
          };
        }
        
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Only retry for network/server errors, not client errors
      const isServerError = error.message?.includes('502') || 
                           error.message?.includes('503') || 
                           error.message?.includes('504') ||
                           error.message?.includes('network');
      
      return isServerError && failureCount < 3;
    },
    staleTime: 0 // Don't cache this data
  });

  const getSubscriptionStatus = () => {
    if (profileLoading) return 'Loading...';
    if (profile?.subscription_status === "unknown") return "Connection Error";
    if (!profile?.is_subscribed) return 'Free Plan';
    
    if (profile.subscription_status === 'active') return 'Premium Active';
    return profile.subscription_status;
  };

  const syncSubscription = async () => {
    try {
      setIsLoading(true);
      toast.info("Checking subscription status with Stripe...");
      
      const { data, error } = await retryApiCall(() => 
        supabase.functions.invoke('sync-subscription', {
          body: {}
        })
      );
      
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
      
      if (error.message?.includes('502') || 
          error.message?.includes('503') || 
          error.message?.includes('504') ||
          error.message?.includes('Gateway')) {
        toast.error("Server connection issue. Please try again later.");
      } else {
        toast.error('Failed to sync subscription status. Please try again.');
      }
      
      trackError(error, 'syncing subscription', { 
        severity: 'medium',
        context: { profile }
      });
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
      } = await retryApiCall(() => 
        supabase.functions.invoke('create-checkout-session', {
          body: {
            priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
            returnUrl: window.location.origin + '/settings',
            includeTrialPeriod: true // Always include trial period for new subscribers
          }
        })
      );
      
      if (error) throw error;
      window.location.href = data.url;
      return false; // Success, no need to show App Store info
    } catch (error) {
      console.error('Error starting subscription:', error);
      
      if (error.message?.includes('502') || 
          error.message?.includes('503') || 
          error.message?.includes('504') ||
          error.message?.includes('Gateway')) {
        toast.error("Server connection issue. Please try again later.");
      } else {
        toast.error('Failed to start subscription. Please try again.');
      }
      
      trackError(error, 'starting subscription', { 
        severity: 'medium',
        context: { profile }
      });
      
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
      } = await retryApiCall(() => 
        supabase.functions.invoke('create-customer-portal', {
          body: {
            returnUrl: window.location.origin + '/settings'
          }
        })
      );
      
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
      
      if (error.message?.includes('502') || 
          error.message?.includes('503') || 
          error.message?.includes('504') ||
          error.message?.includes('Gateway')) {
        toast.error("Server connection issue. Please try again later.");
      } else {
        toast.error('Failed to open subscription management. Please try again.');
      }
      
      trackError(error, 'opening customer portal', { 
        severity: 'medium',
        context: { profile }
      });
      
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
      const { data, error } = await retryApiCall(() =>
        supabase.functions.invoke('sync-subscription', {
          body: { restore: true }
        })
      );
      
      if (error) throw error;
      
      await refetch();
      
      if (data?.restored) {
        toast.success("Your purchases have been restored successfully!");
      } else {
        toast.info("No previous purchases found to restore.");
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      
      if (error.message?.includes('502') || 
          error.message?.includes('503') || 
          error.message?.includes('504') ||
          error.message?.includes('Gateway')) {
        toast.error("Server connection issue. Please try again later.");
      } else {
        toast.error('Failed to restore purchases. Please try again.');
      }
      
      trackError(error, 'restoring purchases', { 
        severity: 'medium',
        context: { profile }
      });
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
