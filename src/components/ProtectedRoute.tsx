
import { useEffect, useState, useCallback, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const location = useLocation();
  const initialCheckComplete = useRef(false);

  // Use memo to prevent unnecessary rerenders
  const checkAuth = useCallback(async () => {
    if (initialCheckComplete.current) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
      initialCheckComplete.current = true;
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoading(false);
      setIsAuthenticated(false);
      initialCheckComplete.current = true;
    }
  }, []);

  // Check for existing session on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for auth state changes with cleanup
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile data only when authenticated and not during initial loading
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
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
    enabled: isAuthenticated && !isLoading,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes instead of every minute
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
    retry: 1, // Only retry once to prevent excessive API calls
  });
  
  // Spinner component
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="rounded-full h-12 w-12 border-b-2 border-white animate-spin"></div>
        <p className="text-white mt-4">Loading your habits...</p>
      </motion.div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user is in onboarding flow
  const isOnboardingRoute = location.pathname === '/onboarding';
  
  // If user is authenticated and on the onboarding path, allow them to continue
  if (isOnboardingRoute) {
    return <>{children}</>;
  }

  return <>{children}</>;
};
