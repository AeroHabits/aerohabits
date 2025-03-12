
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { syncSubscriptionStatus } from "@/utils/subscription/syncSubscription";
import { isRunningInIOSApp, openIOSSubscriptionManagement } from "@/utils/subscription/iosDetection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionCard() {
  const [isLoading, setIsLoading] = useState(false);
  const { profile, isLoading: profileLoading, refetch, isSubscribed } = useSubscription();

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
        // For web, use the customer portal function
        const {
          data,
          error
        } = await supabase.functions.invoke('create-customer-portal', {
          body: { returnUrl: window.location.origin + '/settings' }
        });
        
        if (error) throw error;
        
        if (data?.url) {
          window.location.href = data.url;
        } else if (data?.shouldUseAppStore) {
          toast.info("Please manage your subscription through the App Store Settings");
        } else {
          throw new Error('No portal URL returned');
        }
      }
    } catch (error) {
      console.error('Error opening subscription management:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncSubscription = () => {
    syncSubscriptionStatus(refetch, setIsLoading);
  };

  const getSubscriptionStatus = () => {
    if (profileLoading || isLoading) return 'Loading...';
    if (!profile?.is_subscribed) return 'Free Plan';
    return profile.subscription_status === 'active' 
      ? 'Premium Active' 
      : profile.subscription_status;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden mb-6">
      <CardHeader className="border-b border-white/10 relative">
        <div className="absolute top-0 right-0 h-20 w-20 opacity-30 pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Premium Membership
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <h3 className="text-sm font-medium text-gray-200">
            Status: {getSubscriptionStatus()}
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          {isSubscribed 
            ? "Manage your subscription, view payment history, and update payment method."
            : "Unlock premium features, detailed insights, and personalized tracking"}
        </p>
        
        <div className="space-y-3">
          {isSubscribed ? (
            <>
              <Button 
                onClick={handleManageSubscription}
                disabled={isLoading}
                variant="premium"
                className="w-full font-medium shadow-lg"
              >
                {isLoading ? "Loading..." : "Manage Subscription"}
              </Button>
              <Button
                onClick={handleSyncSubscription}
                disabled={isLoading}
                variant="outline"
                className="w-full text-gray-300 border-gray-700"
              >
                {isLoading ? "Syncing..." : "Sync Subscription Status"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => window.location.href = '/premium'}
              variant="premium"
              className="w-full font-medium shadow-lg"
            >
              Get Premium
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
