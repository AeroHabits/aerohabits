
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { GradientBackground } from "@/components/premium/GradientBackground";
import { PricingCard } from "@/components/premium/PricingCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { SubscriptionTerms } from "@/components/premium/SubscriptionTerms";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Enhanced gradient background */}
      <GradientBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleBackClick} 
              className="text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-white/10 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <PageHeader />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center space-y-2"
          >
            <h2 className="text-xl text-white font-medium">Complete Your Account Setup</h2>
            <p className="text-gray-300">
              Your free trial begins after entering payment information.
              <br />You won't be charged until your trial ends.
            </p>
          </motion.div>

          <PricingCard 
            features={premiumFeatures}
            premiumChallenges={premiumChallenges}
          />
          
          {/* Add subscription terms with legal details */}
          <SubscriptionTerms />
        </div>
      </div>
    </div>
  );
}
