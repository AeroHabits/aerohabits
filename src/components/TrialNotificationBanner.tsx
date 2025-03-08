
import { Clock, CreditCard, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export function TrialNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Get profile data to check trial status
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, trial_end_date')
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
  
  // Check if user is actually in a trial period with an active subscription
  const isInTrial = profile?.subscription_status === 'trialing' && daysRemaining > 0;
  
  // Check local storage for last shown timestamp
  useEffect(() => {
    const checkAndSetVisibility = () => {
      if (!isInTrial) {
        setIsVisible(false);
        return;
      }
      
      const lastShown = localStorage.getItem('trialNotificationLastShown');
      const now = new Date().toDateString();
      
      if (lastShown !== now) {
        setIsVisible(true);
      }
    };
    
    checkAndSetVisibility();
  }, [isInTrial, profile]);
  
  // Handle dismissal of the notification
  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('trialNotificationLastShown', new Date().toDateString());
  };
  
  if (!isVisible || !isInTrial) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center"
        >
          <div className="bg-[#2D2416] border border-[#3D321E] text-[#E9C85D] rounded-lg p-4 shadow-lg max-w-md w-full">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium text-lg">
                  Trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                </span>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-[#E9C85D] hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 space-y-2">
              <p className="text-[#c4ad69]">
                Your credit card will be automatically charged $9.99/month when your trial ends unless you cancel before the trial period ends.
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <CreditCard className="h-4 w-4" />
                <p className="text-[#c4ad69]">
                  Manage your subscription in your <Link to="/settings" className="underline hover:text-white">account settings</Link> or via the App Store.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
