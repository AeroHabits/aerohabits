
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { isRunningInIOSApp, triggerIOSPurchase } from "@/utils/subscription/iosDetection";

export function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false);

  // Get user's subscription status
  const {
    data: profile,
    isLoading: isProfileLoading
  } = useQuery({
    queryKey: ['subscription-profile'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      const {
        data,
        error
      } = await supabase.from('profiles').select('subscription_status, is_subscribed, app_store_subscription_id').eq('id', user.id).single();
      if (error) throw error;
      return data;
    }
  });
  
  const hasActiveSubscription = profile?.is_subscribed || profile?.subscription_status === 'active';
  
  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      // Get current auth session
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You need to be logged in to subscribe');
        window.location.href = '/auth';
        return;
      }
      
      if (hasActiveSubscription) {
        // For iOS: Redirect to subscription management in Settings app
        toast.info('Please manage your subscription in your device settings');
        return;
      }

      // Trigger StoreKit purchase flow with product ID
      const isIOS = isRunningInIOSApp();
      
      if (isIOS) {
        triggerIOSPurchase('premium_monthly_subscription');
        toast.info('Starting in-app purchase...');
      } else {
        toast.info('In-app purchases are only available on iOS devices');
      }
      
    } catch (error) {
      console.error('Error initiating subscription:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.5,
        delay: 0.8
      }} 
      className="relative space-y-4"
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
        onClick={handleSubscribe}
        disabled={isLoading || isProfileLoading}
        className="relative w-full px-8 py-6 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all shadow-xl"
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            "Processing..."
          ) : hasActiveSubscription ? (
            <>Manage Subscription <Crown className="w-5 h-5 text-yellow-500" /></>
          ) : (
            <>Subscribe Now <Sparkles className="w-5 h-5 text-indigo-500" /></>
          )}
        </span>
      </Button>
    </motion.div>
  );
}
