
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsAuthenticated(true);
          
          // Check if this is a new user who needs to complete the questionnaire
          const isNewUser = user.user_metadata?.is_new_user;
          
          // Check if user has already completed the quiz
          const { data: quizResponses } = await supabase
            .from('user_quiz_responses')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
            
          // Check if user has an active subscription
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_subscribed, subscription_status')
            .eq('id', user.id)
            .maybeSingle();
            
          const hasActiveSubscription = profile?.is_subscribed || 
            ['active', 'trialing'].includes(profile?.subscription_status || '');
            
          // Only require onboarding if:
          // 1. User is marked as new AND
          // 2. They don't have quiz responses AND
          // 3. They're not already on the onboarding page AND
          // 4. They don't already have an active subscription
          if (isNewUser && !quizResponses && window.location.pathname !== '/onboarding' && !hasActiveSubscription) {
            setRequiresOnboarding(true);
          }
        } else {
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
        setIsAuthenticated(!!session);
        setIsLoading(false);
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
    return <Navigate to="/auth" replace />;
  }
  
  if (requiresOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
