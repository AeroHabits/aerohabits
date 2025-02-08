
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const isReset = searchParams.get("reset") === "true";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated background elements */}
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
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center text-white tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
        >
          AEROHABITS
        </motion.h1>
        
        {/* Auth card with enhanced glassmorphism */}
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

