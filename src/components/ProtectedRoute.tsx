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
        
        // If there's a session, get the user
        if (sessionData.session) {
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
            
            // If the user has neither completed the quiz NOR has an active subscription,
            // they must go through onboarding
            if (!hasCompletedQuiz || !hasActiveSubscription) {
              console.log('User requires onboarding - no quiz responses or subscription');
              setRequiresOnboarding(true);
              setIsAuthenticated(true);
            } else {
              // Otherwise, user is fully authenticated and can access the app
              setIsAuthenticated(true);
            }
          } else {
            console.log("No user found in session");
            setIsAuthenticated(false);
          }
        } else {
          console.log("No active session found");
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
        
        // Don't immediately set authenticated here, need to check onboarding status
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
  }, []);

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

  return <>{children}</>;
};
