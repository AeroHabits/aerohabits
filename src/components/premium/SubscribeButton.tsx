
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Star, Zap, Info, ExternalLink } from "lucide-react";
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
  
  // Check if the user is on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative"
      >
        <motion.div 
          className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-75"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [0.98, 1.01, 0.98]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatType: "mirror" 
          }}
        />
        
        <Button
          onClick={hasActiveSubscription ? handleManageSubscription : handleSubscribe}
          disabled={isLoading || isProfileLoading}
          variant="premium"
          className="relative w-full py-7 text-lg font-semibold tracking-wide rounded-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className="absolute w-40 h-40 -top-10 -left-10 bg-white/20 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-500"></span>
          <span className="absolute w-40 h-40 -bottom-10 -right-10 bg-white/20 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-500 delay-100"></span>
          
          <motion.span 
            className="absolute -top-1 -right-1 text-yellow-300"
            animate={{ 
              rotate: [0, 15, 0, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop" 
            }}
          >
            <Star className="h-5 w-5 drop-shadow-md" />
          </motion.span>
          
          <span className="relative z-10 flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                Processing...
              </>
            ) : hasActiveSubscription ? (
              <>
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Crown className="w-5 h-5 text-yellow-300" />
                </motion.div>
                Manage Subscription
              </>
            ) : (
              <>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </motion.div>
                Start 3-Day Free Trial
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 0, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </motion.div>
              </>
            )}
          </span>
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
      </motion.div>
      
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
