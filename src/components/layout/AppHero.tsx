
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Sparkles, Clock } from "lucide-react";
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
        .select('*, subscription_status, is_subscribed, trial_end_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Calculate days remaining in trial
  const getDaysRemaining = () => {
    if (!profile?.trial_end_date) return 0;
    
    const trialEnd = new Date(profile.trial_end_date);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();
  const isInTrial = daysRemaining > 0;
  const isActiveSubscriber = profile?.subscription_status === 'active';

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
        className="text-3xl md:text-5xl font-bold tracking-tight"
      >
        <span className="relative inline-block">
          {/* Glow effect behind text */}
          <span className="absolute inset-0 blur-md bg-gradient-to-r from-blue-400/30 via-purple-500/30 to-blue-400/30 rounded-lg -z-10"></span>
          
          {/* Main text with gradient */}
          <span className="bg-gradient-to-r from-blue-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent drop-shadow-sm animate-gradient-x">
            Journey To Self-Mastery
          </span>
        </span>
      </motion.h2>
      
      {/* Animated underline */}
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "200px", opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="h-1 bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0 mx-auto rounded-full"
      />
      
      <p className="text-lg text-white/80 max-w-2xl mx-auto">
        Track your habits, build streaks, and achieve your goals.
      </p>

      {isInTrial && !isActiveSubscriber && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg p-3 max-w-md mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-amber-300">
            <Clock className="h-5 w-5" />
            <span className="font-medium">
              Trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-sm text-amber-200/80 mt-1">
            Your credit card will be automatically charged when your trial ends.
          </p>
        </motion.div>
      )}

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

            <div className="max-w-md mx-auto">
              <SubscriptionCard isLoading={isLoading} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
