import { useState, useEffect } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "@/components/ui/loader";

export default function Auth() {
  const [view, setView] = useState<"sign-in" | "sign-up" | "reset-password">("sign-in");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User already authenticated, checking onboarding status");
          
          // Check if user is new and needs onboarding
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user?.user_metadata?.is_new_user === true) {
            console.log("New user detected, redirecting to onboarding");
            navigate("/onboarding");
            return;
          }
          
          // If user has completed onboarding but doesn't have an active subscription,
          // redirect to payment page
          if (user?.user_metadata?.has_completed_onboarding === true) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('is_subscribed, subscription_status')
              .eq('id', user.id)
              .single();
              
            const hasActiveSubscription = profile?.is_subscribed || 
              ['active', 'trialing'].includes(profile?.subscription_status || '');
              
            if (!hasActiveSubscription) {
              console.log("User needs to set up payment, redirecting to premium page");
              navigate("/premium");
              return;
            }
          }
          
          // Otherwise redirect to home
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const toggleView = (newView: "sign-in" | "sign-up" | "reset-password") => {
    setView(newView);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
        <Loader className="text-white" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        {view === "sign-in" && (
          <SignInForm 
            onToggleForm={() => toggleView("sign-up")} 
            onResetPassword={() => toggleView("reset-password")}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {view === "sign-up" && (
          <SignUpForm 
            onToggleForm={() => toggleView("sign-in")}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {view === "reset-password" && (
          <ResetPasswordForm 
            onToggleForm={() => toggleView("sign-in")}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </div>
  );
}
