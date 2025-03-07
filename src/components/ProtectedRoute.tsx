
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

interface ProtectedRouteProps {
  children: ReactNode;
  requireSubscription?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireSubscription = true 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("User not authenticated");
          setIsAuthenticated(false);
          setIsChecking(false);
          return;
        }

        // User is authenticated
        setIsAuthenticated(true);
        
        // Check user metadata
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsChecking(false);
          return;
        }
        
        // Check if new user needs onboarding
        const isNewUser = user.user_metadata?.is_new_user === true;
        const hasCompletedOnboarding = user.user_metadata?.has_completed_onboarding === true;
        
        setNeedsOnboarding(isNewUser);
        setHasCompletedOnboarding(hasCompletedOnboarding);
        
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Error checking your account status");
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch subscription status if authentication check is complete
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['protected-profile'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated === true && !isChecking && requireSubscription,
  });

  // Show loading while checking auth status
  if (isChecking || (requireSubscription && isLoadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader className="text-indigo-500" size="lg" />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if needed (except if already on onboarding page)
  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to premium page if onboarding is complete but no subscription
  // (except if already on premium page)
  if (requireSubscription && hasCompletedOnboarding && location.pathname !== "/premium") {
    const hasActiveSubscription = profile?.is_subscribed || 
      ['active', 'trialing'].includes(profile?.subscription_status || '');

    if (!hasActiveSubscription) {
      return <Navigate to="/premium" replace />;
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};
