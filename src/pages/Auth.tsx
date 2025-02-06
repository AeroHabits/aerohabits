
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with rich blue/indigo gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/30 via-[#818CF8]/20 to-[#6366F1]/10" />
      
      {/* Animated floating orbs with indigo/blue colors */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#4F46E5]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#6366F1]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-40 w-60 h-60 bg-[#818CF8]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Card with enhanced glassmorphism effect */}
      <Card className="w-full max-w-md p-8 space-y-6 relative z-10 bg-white/10 backdrop-blur-lg border border-[#818CF8]/20 shadow-xl rounded-2xl animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/10 via-[#818CF8]/5 to-transparent rounded-2xl" />
        <div className="relative z-10">
          {isSignUp ? (
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
    </div>
  );
};

export default Auth;

