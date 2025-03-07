
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { SubscriptionTerms } from "@/components/premium/SubscriptionTerms";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { PremiumFeatureCard, premiumFeatures } from "@/components/subscription/PremiumFeatureCard";

export default function Premium() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define features as simple strings
  const premiumFeatures = [
    "Advanced tracking with detailed insights",
    "Personalized AI recommendations",
    "Priority customer support",
    "Track unlimited habits",
    "Weekly and monthly progress reports",
    "Custom reminders and notifications"
  ];
  
  // Define challenges with title and description
  const premiumChallenges = [
    {
      title: "Master Challenges",
      description: "Access exclusive premium difficulty challenges designed to push your limits"
    },
    {
      title: "Custom Challenge Creation",
      description: "Create personalized challenges tailored to your specific goals and needs"
    },
    {
      title: "Challenge Analytics",
      description: "Get detailed performance metrics and insights for all your challenges"
    }
  ];

  // Check user flow and ensure proper redirection
  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user is authenticated, redirect to auth
        console.log("No authenticated user in Premium page, redirecting to auth");
        navigate('/auth');
        return;
      }
      
      // Check if user has completed the quiz/onboarding
      const { data: quizResponses, error: quizError } = await supabase
        .from('user_quiz_responses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (quizError) {
        console.error('Error checking quiz responses:', quizError);
      }
      
      // Check if user has an active subscription
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status')
        .eq('id', user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error checking profile:', profileError);
      }
        
      const hasCompletedQuiz = !!quizResponses;
      const hasActiveSubscription = profile?.is_subscribed || 
        ['active', 'trialing'].includes(profile?.subscription_status || '');
      
      console.log("Has completed quiz in Premium:", hasCompletedQuiz);
      console.log("Has active subscription in Premium:", hasActiveSubscription);
      
      // If the user has already subscribed, redirect them to the home page
      if (hasActiveSubscription) {
        console.log("User already has active subscription, redirecting to home");
        navigate('/');
        return;
      }
      
      // If the user hasn't completed onboarding yet, redirect them to onboarding
      if (!hasCompletedQuiz) {
        console.log("User hasn't completed onboarding, redirecting to onboarding");
        toast.info("Please complete the onboarding questionnaire first");
        navigate('/onboarding');
        return;
      }
      
      // Determine if the user is coming from onboarding
      const isFromOnboarding = location.state?.fromOnboarding || 
                              location.pathname.includes("onboarding");
      
      if (isFromOnboarding) {
        toast.info("Please complete your payment information to continue", {
          duration: 5000,
          position: "top-center"
        });
      }
    };
    
    checkUserStatus();
  }, [location, navigate]);

  // Handle back button navigation - ensure users can't skip subscription
  const handleBackClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if user has an active subscription
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status')
        .eq('id', user.id)
        .maybeSingle();
        
      const hasActiveSubscription = profile?.is_subscribed || 
        ['active', 'trialing'].includes(profile?.subscription_status || '');
      
      // If user doesn't have an active subscription, show a message
      if (!hasActiveSubscription) {
        toast.error("You need to subscribe to access the app", {
          duration: 3000,
          position: "top-center"
        });
        return;
      }
    }
    
    navigate(-1);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTJ6TTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
      
      {/* Premium glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
      
      <div className="container max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackClick} 
            className="text-gray-400 hover:text-white flex items-center gap-2 transition-all hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <PageHeader />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left column - features & benefits */}
          <div className="md:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 mb-3">
                Elevate Your Experience
              </h1>
              <p className="text-gray-400 leading-relaxed text-lg mb-6">
                Join AeroHabits Premium to unlock powerful tools and features designed to accelerate your habit-building journey.
              </p>
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white/90">Premium Features</h2>
              <div className="grid grid-cols-1 gap-3">
                {premiumFeatures.map((feature, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-3 items-center bg-white/5 backdrop-blur rounded-lg p-3 border border-white/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="p-1.5 rounded-full bg-purple-500/20 text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h2 className="text-xl font-medium text-white/90">Premium Challenges</h2>
              <div className="space-y-3">
                {premiumChallenges.map((challenge, i) => (
                  <PremiumFeatureCard key={i} feature={premiumFeatures[i % premiumFeatures.length]} index={i} />
                ))}
              </div>
            </div>
            
            <SubscriptionTerms />
          </div>
          
          {/* Right column - subscription card */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="sticky top-8">
                <SubscriptionCard />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
