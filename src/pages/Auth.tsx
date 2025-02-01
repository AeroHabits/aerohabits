import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D3E4FD]/90 via-[#E5DEFF]/80 to-[#FDE1D3]/70 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm">
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
      </Card>
    </div>
  );
};

export default Auth;