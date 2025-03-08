import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

export function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { trackError } = useErrorTracking();
  const [showAppStoreInfo, setShowAppStoreInfo] = useState(false);

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
        // For iOS devices, show App Store instructions
        if (isIOS) {
          setShowAppStoreInfo(true);
          return;
        }
        
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
      
      // For iOS devices, inform the user about App Store subscriptions
      if (isIOS) {
        setShowAppStoreInfo(true);
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
      
      // Show App Store instructions as fallback on iOS
      if (isIOS) {
        setShowAppStoreInfo(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    // For iOS devices, show App Store instructions
    if (isIOS) {
      setShowAppStoreInfo(true);
      return;
    }
    
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
      
      // Show App Store instructions as fallback
      setShowAppStoreInfo(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-2">
        <Button
          onClick={hasActiveSubscription ? handleManageSubscription : handleSubscribe}
          disabled={isLoading || isProfileLoading}
          className="w-full py-6 text-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            "Processing..."
          ) : hasActiveSubscription ? (
            "Manage Subscription"
          ) : (
            "Start 3-Day Free Trial"
          )}
        </Button>
        
        {!hasActiveSubscription && (
          <div className="mt-2 text-center space-y-1">
            <p className="text-sm text-gray-300">
              $9.99/month after 3-day free trial
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <span>Auto-renews unless canceled.</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>Your Apple ID will be charged at the end of the trial period unless canceled at least 24 hours before the end of the trial. Subscription automatically renews unless auto-renew is turned off.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
      
      <AlertDialog open={showAppStoreInfo} onOpenChange={setShowAppStoreInfo}>
        <AlertDialogContent className="bg-gray-900 border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {hasActiveSubscription ? "Manage Your Subscription" : "Subscribe via App Store"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {hasActiveSubscription 
                ? "To manage your subscription on iOS devices, please follow these steps:" 
                : "To subscribe to AeroHabits Premium on iOS devices:"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2 text-gray-300">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Open the <span className="font-medium text-white">Settings</span> app on your iOS device</li>
              <li>Tap your <span className="font-medium text-white">Apple ID</span> at the top of the screen</li>
              <li>Select <span className="font-medium text-white">Subscriptions</span></li>
              {hasActiveSubscription ? (
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
              className="bg-indigo-600 text-white hover:bg-indigo-700"
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
