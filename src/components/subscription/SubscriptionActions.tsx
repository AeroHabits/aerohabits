
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isRunningInIOSApp, triggerIOSPurchase, openIOSSubscriptionManagement } from "@/utils/subscription/iosDetection";

interface SubscriptionActionsProps {
  isSubscribed: boolean | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SubscriptionActions({ 
  isSubscribed, 
  isLoading, 
  setIsLoading 
}: SubscriptionActionsProps) {
  
  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // Check if running in iOS app
      const isIOS = isRunningInIOSApp();
      
      if (isIOS) {
        // For iOS, initiate the purchase through the native app
        triggerIOSPurchase('premium_subscription_monthly');
        toast.info("Opening App Store purchase...");
      } else {
        // For web, use the existing flow
        const {
          data,
          error
        } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
            returnUrl: window.location.origin + '/settings',
            includeTrialPeriod: false
          }
        });
        
        if (error) throw error;
        
        if (data.shouldUseAppStore) {
          toast.info("Please purchase through the App Store");
        }
      }
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast.error('Failed to start subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      
      // Check if running in iOS app
      const isIOS = isRunningInIOSApp();
      
      if (isIOS) {
        // For iOS, open the App Store subscription management
        openIOSSubscriptionManagement();
        toast.info("Opening subscription settings...");
      } else {
        // For web, use the updated customer portal function
        const {
          data,
          error
        } = await supabase.functions.invoke('create-customer-portal', {
          body: {
            returnUrl: window.location.origin + '/settings'
          }
        });
        
        if (error) throw error;
        
        if (data.shouldUseAppStore) {
          toast.info("Please manage your subscription through the App Store Settings");
        }
      }
    } catch (error) {
      console.error('Error opening subscription management:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isSubscribed ? (
        <Button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] animate-shimmer" />
          {isLoading ? "Loading..." : "Manage Subscription"}
        </Button>
      ) : (
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-shimmer" />
          {isLoading ? "Loading..." : "Subscribe Now"}
        </Button>
      )}
    </>
  );
}
