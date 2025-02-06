
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Apple, Chrome } from "lucide-react";

export const SocialSignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  const handleAppleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Apple:', error.message);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button 
          variant="outline" 
          onClick={handleAppleSignIn}
          className="w-full"
        >
          <Apple className="mr-2 h-4 w-4" />
          Apple
        </Button>
      </div>
    </div>
  );
};
