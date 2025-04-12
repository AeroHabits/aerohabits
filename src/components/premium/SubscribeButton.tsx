import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
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
      } = await supabase.from('profiles').select('subscription_status, is_subscribed, subscription_id').eq('id', user.id).single();
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

        // Note: In a real implementation, you would use something like:
        // if (capacitor available) {
        //   // Use Capacitor plugin to open iOS subscription settings
        //   App.openUrl({ url: 'app-settings:' });
        // }
        return;
      }

      // For iOS: This is where you would trigger the StoreKit purchase flow
      // This is just a placeholder for now
      toast.info('This will initiate the Apple in-app purchase in the final implementation');

      // Note: In a real StoreKit implementation, you'd do something like:
      // 1. Request available products from App Store
      // 2. Present purchase UI
      // 3. Handle purchase completion
      // 4. Verify receipt with your server
      // 5. Update the user's subscription status in your database

      console.log('StoreKit purchase would be initiated here');
    } catch (error) {
      console.error('Error initiating subscription:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: 0.8
  }} className="relative space-y-4">
      <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-75" animate={{
      opacity: [0.5, 0.8, 0.5],
      scale: [0.98, 1.01, 0.98]
    }} transition={{
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror"
    }} />
      
      
    </motion.div>;
}