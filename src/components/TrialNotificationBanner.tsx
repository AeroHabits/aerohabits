
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  
  // Check if user is in trial period and not subscribed
  const isInTrial = daysRemaining > 0;
  const isActiveSubscriber = profile?.subscription_status === 'active';
  
  // Check local storage for last shown timestamp
  useEffect(() => {
    const checkAndSetVisibility = () => {
      if (!isInTrial || isActiveSubscriber) {
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
  }, [isInTrial, isActiveSubscriber, profile]);
  
  // Handle dismissal of the notification
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('trialNotificationLastShown', new Date().toDateString());
  };
  
  // Add click event listener for document to dismiss trial notice
  useEffect(() => {
    if (!isVisible) return;
    
    const handleDocumentClick = () => {
      handleDismiss();
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isVisible]);
  
  if (!isVisible || !isInTrial || isActiveSubscriber) {
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
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium text-lg">
                  Trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[#c4ad69]">
                Your credit card will be automatically charged when your trial ends.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
