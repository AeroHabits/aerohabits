
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);
  const location = useLocation();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [cachedAuthState, setCachedAuthState] = useState<{
    isAuthenticated: boolean;
    requiresOnboarding: boolean;
    timestamp: number;
  } | null>(null);

  // Cache TTL in milliseconds (5 minutes)
  const CACHE_TTL = 5 * 60 * 1000;

  useEffect(() => {
    // Try to get cached auth state first for faster rendering
    const cachedState = localStorage.getItem('authState');
    if (cachedState) {
      try {
        const parsed = JSON.parse(cachedState);
        const now = Date.now();
        // Only use cache if it's still valid
        if (now - parsed.timestamp < CACHE_TTL) {
          setCachedAuthState(parsed);
          setIsAuthenticated(parsed.isAuthenticated);
          setRequiresOnboarding(parsed.requiresOnboarding);
          // Still perform the full check in the background
        } else {
          // Cache expired, remove it
          localStorage.removeItem('authState');
        }
      } catch (e) {
        console.error('Error parsing cached auth state:', e);
        localStorage.removeItem('authState');
      }
    }

    const checkUser = async () => {
      try {
        // Get the current session first
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsAuthenticated(false);
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        // If there's no session, user is not authenticated
        if (!sessionData.session) {
          console.log("No active session found, redirecting to auth");
          setIsAuthenticated(false);
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        // Session exists, get the user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("User authenticated:", user.id);
          const userMeta = user.user_metadata || {};
          const isNewUser = userMeta.is_new_user === true;
          const hasCompletedOnboarding = userMeta.has_completed_onboarding === true;
          
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
          console.log("Is new user:", isNewUser);
          console.log("Has completed onboarding:", hasCompletedOnboarding);
          
          // If the user is new OR hasn't completed the quiz AND doesn't have an active subscription,
          // they must go through onboarding
          if ((isNewUser || !hasCompletedQuiz) && !hasActiveSubscription && !hasCompletedOnboarding) {
            console.log('User requires onboarding - needs to complete quiz or get subscription');
            setRequiresOnboarding(true);
          } else {
            setRequiresOnboarding(false);
          }
          
          // Cache the authentication state for faster loading next time
          const authState = {
            isAuthenticated: true,
            requiresOnboarding: (isNewUser || !hasCompletedQuiz) && !hasActiveSubscription && !hasCompletedOnboarding,
            timestamp: Date.now()
          };
          localStorage.setItem('authState', JSON.stringify(authState));
          
          // User is authenticated regardless of onboarding status
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
        setSessionChecked(true);
      }
    };

    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        if (event === 'SIGNED_OUT') {
          // Clear cached auth state on sign out
          localStorage.removeItem('authState');
          setIsAuthenticated(false);
          setIsLoading(false);
          setSessionChecked(true);
          return;
        }
        
        if (session) {
          checkUser(); // Re-run the full check
        } else {
          setIsAuthenticated(false);
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // If initial render and we have no cache yet, show minimal loader
  if (!sessionChecked && !cachedAuthState) {
    return <div className="flex items-center justify-center min-h-screen"><Loader size="lg" /></div>;
  }

  // If still loading after initial check and we don't have cached state, show full loader
  if (isLoading && !cachedAuthState) {
    return <div className="flex items-center justify-center min-h-screen"><Loader size="lg" /></div>;
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
