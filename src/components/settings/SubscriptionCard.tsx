
import { Crown, Star, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SubscriptionCard() {
  const [isLoading, setIsLoading] = useState(false);
  const { trackError } = useErrorTracking();
  const [showAppStoreInfo, setShowAppStoreInfo] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    retry: false,
    staleTime: 0 // Don't cache this data
  });

  // Check if the user is on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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

      if (error) {
        throw error;
      }
      
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
      toast.error('Could not open subscription settings. Please try again.');
      // Show App Store instructions as fallback
      setShowAppStoreInfo(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionStatus = () => {
    if (profileLoading) return 'Loading...';
    if (!profile?.is_subscribed) return 'Free Plan';
    return profile.subscription_status === 'active' 
      ? 'Premium Active' 
      : profile.subscription_status;
  };

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
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
            AeroHabits Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <h3 className="text-sm font-medium text-gray-200">
              Status: {getSubscriptionStatus()}
            </h3>
          </div>
          <p className="text-sm text-gray-400">
            {profile?.is_subscribed 
              ? "Manage your subscription, view payment history, and update payment method."
              : "Unlock premium features, detailed insights, and personalized tracking"}
          </p>
          {profile?.is_subscribed ? (
            <Button 
              onClick={handleManageSubscription}
              disabled={isLoading}
              variant="premium"
              className="w-full font-medium shadow-lg"
            >
              {isLoading ? "Loading..." : "Manage Subscription"}
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = '/premium'}
              variant="premium"
              className="w-full font-medium shadow-lg"
            >
              Get Premium
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showAppStoreInfo} onOpenChange={setShowAppStoreInfo}>
        <AlertDialogContent className="bg-gray-900 border border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Manage Your Subscription</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              To manage your subscription on iOS devices, please follow these steps:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2 text-gray-300">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Open the <span className="font-medium text-white">Settings</span> app on your iOS device</li>
              <li>Tap your <span className="font-medium text-white">Apple ID</span> at the top of the screen</li>
              <li>Select <span className="font-medium text-white">Subscriptions</span></li>
              <li>Find and tap <span className="font-medium text-white">AeroHabits</span> in your list of subscriptions</li>
              <li>Here you can manage, cancel, or change your subscription options</li>
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
              Open Subscriptions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
