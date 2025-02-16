
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PremiumFeatureCard, premiumFeatures } from "@/components/subscription/PremiumFeatureCard";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";

export function AppHero() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubscribe = async (interval: 'month' | 'year') => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to subscribe.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // Create or get Stripe customer
      if (!profile?.stripe_customer_id) {
        const response = await fetch(`${window.location.origin}/functions/v1/create-stripe-customer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create customer');
        }
      }

      // Create checkout session
      const response = await fetch(`${window.location.origin}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interval }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center space-y-4"
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-white/95 tracking-wide"
      >
        <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent animate-gradient-x">
          Journey To Self-Mastery
        </span>
      </motion.h2>
      <div className="h-1 w-32 mx-auto bg-gradient-to-r from-white/0 via-white/80 to-white/0 animate-pulse" />
      <p className="text-lg text-white/80 max-w-2xl mx-auto">
        Track your habits, build streaks, and achieve your goals.
      </p>

      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            onClick={() => setShowFeatures(!showFeatures)}
            className="relative group bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                background: ["linear-gradient(to right, rgba(168,85,247,0.1), rgba(59,130,246,0.1))", 
                           "linear-gradient(to right, rgba(59,130,246,0.1), rgba(168,85,247,0.1))"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <Sparkles className="mr-2 h-4 w-4 text-yellow-300 animate-pulse" />
            {showFeatures ? (
              <>
                Hide Subscriptions <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Subscriptions <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>

        {showFeatures && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              {premiumFeatures.map((feature, index) => (
                <PremiumFeatureCard 
                  key={feature.title}
                  feature={feature}
                  index={index}
                />
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
              <SubscriptionCard
                type="month"
                isLoading={isLoading}
                isSubscribed={!!profile?.is_subscribed}
                onSubscribe={handleSubscribe}
              />
              <SubscriptionCard
                type="year"
                isLoading={isLoading}
                isSubscribed={!!profile?.is_subscribed}
                onSubscribe={handleSubscribe}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
