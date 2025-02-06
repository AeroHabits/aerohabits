
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient and blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/30 via-[#D3E4FD]/20 to-[#0EA5E9]/10" />
      
      {/* Animated floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#8B5CF6]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#0EA5E9]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-40 w-60 h-60 bg-[#D6BCFA]/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Card with glassmorphism effect */}
      <Card className="w-full max-w-md p-8 space-y-6 relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-transparent rounded-2xl" />
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
