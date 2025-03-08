import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);
  const [requiresSubscription, setRequiresSubscription] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get the current session first
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // If there's no session, user is not authenticated
        if (!sessionData.session) {
          console.log("No active session found, redirecting to auth");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Session exists, get the user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("User authenticated:", user.id);
          console.log("User metadata:", user.user_metadata);
          
          // Check if user has already completed the quiz
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
          
          console.log("Has completed quiz:", hasCompletedQuiz);
          console.log("Has active subscription:", hasActiveSubscription);
          
          // New logic: If user has completed the quiz but doesn't have an active subscription,
          // they must subscribe (unless they're already on the premium page)
          if (hasCompletedQuiz && !hasActiveSubscription && location.pathname !== '/premium') {
            console.log('User needs to subscribe - has completed quiz but no subscription');
            setRequiresSubscription(true);
          }
          
          // If the user has neither completed the quiz NOR has an active subscription,
          // they must go through onboarding
          if (!hasCompletedQuiz && !hasActiveSubscription) {
            console.log('User requires onboarding - no quiz responses or subscription');
            setRequiresOnboarding(true);
          }
          
          // User is authenticated regardless of onboarding/subscription status
          setIsAuthenticated(true);
        } else {
          console.log("No user found in session");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          checkUser(); // Re-run the full check
        } else {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location.pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // This is the key logic - redirect to onboarding for all routes except /onboarding
  // if the user requires onboarding
  if (requiresOnboarding && location.pathname !== '/onboarding') {
    console.log("User requires onboarding, redirecting to /onboarding");
    return <Navigate to="/onboarding" replace />;
  }

  // NEW: If the user requires a subscription, redirect them to the premium page
  if (requiresSubscription && location.pathname !== '/premium') {
    console.log("User requires subscription, redirecting to /premium");
    toast.info("Please subscribe to continue using the app", {
      description: "Your free trial has ended or you need to complete the subscription process",
      duration: 5000
    });
    return <Navigate to="/premium" replace />;
  }

  return <>{children}</>;
};
