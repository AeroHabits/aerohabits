
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const location = useLocation();

  const { data: profile, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status, trial_end_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
    refetchInterval: 5000, // Refetch every 5 seconds to catch subscription updates
    staleTime: 0, // Consider data always stale to ensure fresh checks
  });

  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Add URL parameter check
  useEffect(() => {
    if (location.search.includes('success=true')) {
      refetch(); // Force a profile refetch when returning from successful payment
      toast.success("Your subscription has been activated successfully!");
    }
  }, [location.search, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"
        />
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check subscription status
  if (profile) {
    const isSubscriptionActive = profile.subscription_status === 'active';
    const isInTrialPeriod = profile.trial_end_date && new Date(profile.trial_end_date) > new Date();
    const hasActiveAccess = isSubscriptionActive || isInTrialPeriod;
    
    // Define allowed paths that don't require an active subscription
    const allowedPaths = [
      '/auth',
      '/premium',
      '/onboarding'
    ];
    
    const isOnAllowedPath = allowedPaths.includes(location.pathname) || 
                             location.search.includes('success=true');
                         
    if (!hasActiveAccess && !isOnAllowedPath) {
      toast.error("Please subscribe to continue using the app.");
      return <Navigate to="/premium" replace />;
    }
  } else if (isAuthenticated && !profile) {
    // If user is authenticated but has no profile yet, redirect to onboarding
    const isOnboardingOrAuth = location.pathname === '/onboarding' || location.pathname === '/auth';
    
    if (!isOnboardingOrAuth) {
      toast.info("Please complete onboarding to start your free trial.");
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
};
