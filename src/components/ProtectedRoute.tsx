
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

  // Handle app tracking transparency for iOS
  useEffect(() => {
    // This would be replaced with actual implementation when using Capacitor
    // For demonstration purposes only - in production, use Capacitor plugins
    const requestAppTrackingTransparency = async () => {
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        console.log('Would request App Tracking Transparency permission on real iOS device');
        // In a real implementation with Capacitor:
        // const { status } = await Plugins.AppTrackingTransparency.requestPermission();
      }
    };

    requestAppTrackingTransparency();
  }, []);

  // First, check if user is authenticated
  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth session check:", !!session);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change:", !!session);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Only fetch profile data if the user is authenticated
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
    enabled: isAuthenticated, // Only run this query if the user is authenticated
    refetchInterval: 5000, // Refetch every 5 seconds to catch subscription updates
    staleTime: 0, // Consider data always stale to ensure fresh checks
  });

  // Add URL parameter check
  useEffect(() => {
    if (location.search.includes('success=true') && isAuthenticated) {
      refetch(); // Force a profile refetch when returning from successful payment
      toast.success("Your subscription has been activated successfully!");
    }
  }, [location.search, refetch, isAuthenticated]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-white"
          />
          <p className="text-white mt-4">Loading your habits...</p>
        </motion.div>
      </div>
    );
  }

  // If not authenticated, always redirect to auth page
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user is in onboarding flow
  const isOnboardingRoute = location.pathname === '/onboarding';
  
  // If user is authenticated and on the onboarding path, allow them to continue
  if (isOnboardingRoute) {
    return <>{children}</>;
  }

  // Only check subscription status for authenticated users on non-onboarding paths
  if (profile) {
    const isSubscriptionActive = profile.subscription_status === 'active';
    const isInTrialPeriod = profile.trial_end_date && new Date(profile.trial_end_date) > new Date();
    const hasActiveAccess = isSubscriptionActive || isInTrialPeriod;
    
    // Don't redirect if:
    // 1. User has active subscription or is in trial period OR
    // 2. Already on premium page OR
    // 3. Just completed payment (success=true in URL)
    const isOnPremiumOrPaymentFlow = location.pathname === '/premium' || 
                                    location.search.includes('success=true');
                         
    if (!hasActiveAccess && !isOnPremiumOrPaymentFlow) {
      console.log("User needs to subscribe: redirecting to /premium");
      toast.error("Please subscribe to continue using the app.");
      return <Navigate to="/premium" replace />;
    }
  }

  return <>{children}</>;
};
