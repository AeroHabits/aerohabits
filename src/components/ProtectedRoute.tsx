
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useErrorTracking } from "@/hooks/useErrorTracking";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);
  const [requiresSubscription, setRequiresSubscription] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const location = useLocation();
  const { trackError } = useErrorTracking();

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1500; // 1.5 seconds

    // Function to check user session with retry logic
    const checkUser = async () => {
      try {
        // Get the current session first
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (isMounted) {
            setAuthError(sessionError);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }
        
        // If there's no session, user is not authenticated
        if (!sessionData.session) {
          console.log("No active session found, redirecting to auth");
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }
        
        // Session exists, check if it's expired
        const now = Math.floor(Date.now() / 1000);
        if (sessionData.session.expires_at && sessionData.session.expires_at < now) {
          console.log("Session has expired, attempting refresh");
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.error("Failed to refresh session:", refreshError);
            if (isMounted) {
              setIsAuthenticated(false);
              setIsLoading(false);
            }
            return;
          }
          
          console.log("Session refreshed successfully");
        }
        
        // Get user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error getting user:", userError);
          trackError(userError, "auth.getUser", { severity: "high" });
          
          // Try refresh session if user fetch fails
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshData.session) {
            if (isMounted) {
              setIsAuthenticated(false);
              setIsLoading(false);
            }
            return;
          }
        }
        
        if (user) {
          console.log("User authenticated:", user.id);
          
          try {
            // Check if user has already completed the quiz
            const { data: quizResponses, error: quizError } = await supabase
              .from('user_quiz_responses')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (quizError) {
              console.error('Error checking quiz responses:', quizError);
              trackError(quizError, "user_quiz_responses.select", { severity: "medium" });
            }
              
            // Check if user has an active subscription
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('is_subscribed, subscription_status')
              .eq('id', user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error('Error checking profile:', profileError);
              trackError(profileError, "profiles.select", { severity: "medium" });
            }
              
            const hasCompletedQuiz = !!quizResponses;
            const hasActiveSubscription = profile?.is_subscribed || 
              ['active', 'trialing'].includes(profile?.subscription_status || '');
            
            if (isMounted) {
              if (hasCompletedQuiz && !hasActiveSubscription && location.pathname !== '/premium') {
                setRequiresSubscription(true);
              }
              
              if (!hasCompletedQuiz && !hasActiveSubscription) {
                setRequiresOnboarding(true);
              }
              
              // User is authenticated regardless of onboarding/subscription status
              setIsAuthenticated(true);
              setIsLoading(false);
            }
          } catch (error) {
            console.error("Error checking user status:", error);
            trackError(error as Error, "checkUserStatus", { severity: "high" });
            
            // Still consider the user authenticated if we have their session
            // but there was an error getting additional profile data
            if (isMounted) {
              setIsAuthenticated(true);
              setIsLoading(false);
            }
          }
        } else {
          console.log("No user found in session");
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        trackError(error as Error, "authCheck", { severity: "high" });
        
        // Implement retry logic for transient errors
        if (retryCount < maxRetries && isMounted) {
          retryCount++;
          console.log(`Retrying auth check (${retryCount}/${maxRetries}) in ${retryDelay}ms`);
          setTimeout(checkUser, retryDelay);
        } else if (isMounted) {
          setAuthError(error as Error);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkUser();
    
    // Setup auth state change listener with better error handling
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log("Token was refreshed successfully");
        }
        
        if (session) {
          // Reset retry count when we get a valid auth state change
          retryCount = 0;
          checkUser();
        } else if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    // Clean up
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [location.pathname, trackError]);

  // Show a more informative loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white font-medium">Verifying your session...</p>
          <p className="text-white/70 text-sm mt-2">Please wait while we secure your connection</p>
        </div>
      </div>
    );
  }

  // Show auth error with retry option
  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Connection Problem</h2>
          <p className="text-white/80 mb-4">
            We're having trouble verifying your session. This could be due to network issues.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setIsLoading(true);
                setAuthError(null);
                // Force a session refresh attempt
                supabase.auth.refreshSession().then(() => {
                  window.location.reload();
                }).catch(() => {
                  // If refresh fails, redirect to auth
                  window.location.href = '/auth';
                });
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => {
                window.location.href = '/auth';
              }}
              className="bg-transparent border border-white/30 hover:bg-white/5 text-white rounded-md py-2 px-4 transition-colors"
            >
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  if (requiresOnboarding && location.pathname !== '/onboarding') {
    console.log("User requires onboarding, redirecting to /onboarding");
    return <Navigate to="/onboarding" replace />;
  }

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
