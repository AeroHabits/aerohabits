
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AppHero() {
  const [showTrialNotice, setShowTrialNotice] = useState(true);
  const { toast } = useToast();

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

  // Add click event listener for document to dismiss trial notice
  useEffect(() => {
    const handleDocumentClick = () => {
      setShowTrialNotice(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

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

      {isInTrial && !isActiveSubscriber && showTrialNotice && (
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
    </motion.div>
  );
}
