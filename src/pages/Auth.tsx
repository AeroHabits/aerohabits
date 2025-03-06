
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const isReset = searchParams.get("reset") === "true";
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("User already authenticated, redirecting to home");
        navigate("/");
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  const sendWelcomeEmail = async (userId: string) => {
    try {
      console.log("Sending welcome email to user:", userId);
      const { error } = await supabase.functions.invoke("send-welcome-email", {
        body: { userId }
      });
      
      if (error) {
        console.error("Failed to send welcome email:", error);
      } else {
        console.log("Welcome email sent successfully");
      }
    } catch (err) {
      console.error("Error invoking welcome email function:", err);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "User logged in" : "No session");
      
      if (event === 'SIGNED_IN' && session?.user?.id) {
        const isNewUser = !localStorage.getItem(`welcomed_${session.user.id}`);
        
        if (isNewUser) {
          localStorage.setItem(`welcomed_${session.user.id}`, 'true');
          await sendWelcomeEmail(session.user.id);
        }
        
        // Redirect to the page the user was trying to access or home
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#4F46E5]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#818CF8]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#6366F1]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }} />
      </motion.div>
      
      <div className="w-full max-w-md space-y-8">
        <PageHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10"
        >
          <Card className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl">
            <div className="p-6 space-y-6">
              {isReset ? (
                <ResetPasswordForm
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ) : isSignUp ? (
                <SignUpForm
                  onToggleForm={() => setIsSignUp(false)}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ) : (
                <SignInForm
                  onToggleForm={() => setIsSignUp(true)}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
