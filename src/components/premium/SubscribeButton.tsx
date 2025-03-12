
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
  });

  const hasActiveSubscription = profile?.is_subscribed || profile?.subscription_status === 'active';

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      // Get current auth session
      const { data: { session } } = await supabase.auth.getSession();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
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
              Subscribe Now
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
    </motion.div>
  );
}
