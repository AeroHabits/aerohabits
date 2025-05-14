
import { useEffect, useState, useCallback, useRef } from "react";
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
  const [authError, setAuthError] = useState<string | null>(null);
  const location = useLocation();
  const initialCheckComplete = useRef(false);
  const authRetryCount = useRef(0);
  const initialSignInComplete = useRef(false);
  
  // Store the last auth state to prevent repeated toasts
  const lastAuthState = useRef<string | null>(null);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    if (initialCheckComplete.current) return;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error && authRetryCount.current < 2) {
        authRetryCount.current += 1;
        console.warn("Auth check retry:", authRetryCount.current, error);
        // Wait a moment and try again
        setTimeout(checkAuth, 1000);
        return;
      }
      
      if (error) {
        console.error("Auth check failed:", error);
        setAuthError(error.message);
        setIsLoading(false);
        setIsAuthenticated(false);
        initialCheckComplete.current = true;
        return;
      }
      
      setIsAuthenticated(!!session);
      setIsLoading(false);
      initialCheckComplete.current = true;
      
      // If user is already authenticated on initial load, mark sign-in as complete
      // to prevent the toast from showing on page navigation
      if (session) {
        initialSignInComplete.current = true;
        lastAuthState.current = 'SIGNED_IN';
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthError(error instanceof Error ? error.message : "Authentication check failed");
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
    console.log("Setting up auth state listener");
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, "Previous state:", lastAuthState.current);
      
      setIsAuthenticated(!!session);
      setIsLoading(false);
      
      // Only show toast on actual auth state changes, not every render or navigation
      if (event === 'SIGNED_IN' && lastAuthState.current !== 'SIGNED_IN') {
        toast.success("Successfully signed in");
        lastAuthState.current = 'SIGNED_IN';
        initialSignInComplete.current = true;
      } else if (event === 'SIGNED_OUT' && lastAuthState.current !== 'SIGNED_OUT') {
        toast.info("You have been signed out");
        lastAuthState.current = 'SIGNED_OUT';
        initialSignInComplete.current = false;
      }
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profile data only when authenticated and not during initial loading
  const { data: profile, error: profileError } = useQuery({
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
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
    retry: 1, // Only retry once to prevent excessive API calls
  });
  
  // Show error toast for profile errors
  useEffect(() => {
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      
      // Only show toast for critical errors
      if (isAuthenticated) {
        toast.error("Failed to load profile data. Some features may be limited.");
      }
    }
  }, [profileError, isAuthenticated]);
  
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

  // Show error state
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-700 text-lg font-semibold mb-2">Authentication Error</h2>
          <p className="text-red-600 mb-4">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/auth'}
            className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
