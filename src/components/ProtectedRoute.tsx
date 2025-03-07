
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
  const [requiresPayment, setRequiresPayment] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Checking ProtectedRoute authentication status");
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
          
          console.log("Has completed quiz in ProtectedRoute:", hasCompletedQuiz);
          console.log("Has active subscription in ProtectedRoute:", hasActiveSubscription);
          
          // User must complete these steps in order:
          // 1. Complete onboarding (quiz)
          // 2. Pay for subscription
          
          // If user has not completed the quiz, they must go through onboarding first
          if (!hasCompletedQuiz) {
            console.log('User requires onboarding - no quiz responses');
            setRequiresOnboarding(true);
          }
          // If user has completed the quiz but doesn't have an active subscription,
          // they need to complete payment next
          else if (!hasActiveSubscription) {
            console.log('User requires payment - no active subscription');
            setRequiresPayment(true);
          }
          
          // User is authenticated regardless of onboarding or payment status
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
        console.log("Auth state changed in ProtectedRoute:", event, session ? "Session exists" : "No session");
        
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
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Step 1: Not authenticated - redirect to auth
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Step 2: Authenticated but needs onboarding - redirect to onboarding
  if (requiresOnboarding && location.pathname !== '/onboarding') {
    console.log("User requires onboarding, redirecting to /onboarding");
    return <Navigate to="/onboarding" replace />;
  }
  
  // Step 3: Authenticated and completed onboarding but needs payment - redirect to premium
  if (requiresPayment && location.pathname !== '/premium') {
    console.log("User requires payment, redirecting to /premium");
    toast.info("Please subscribe to continue using the app");
    return <Navigate to="/premium" state={{ fromOnboarding: true }} replace />;
  }

  // All conditions met - show the requested content
  return <>{children}</>;
};
