
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";

interface SignInFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignInForm = ({
  onToggleForm,
  isLoading,
  setIsLoading
}: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);
  
  const { navigate } = useAuthForm();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address to reset your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });
      
      if (error) throw error;
      
      toast.success("Password reset link sent! Please check your email inbox");
      setResetLinkSent(true);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error?.message || "Failed to send reset link. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data.session) {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  if (forgotPasswordMode) {
    return (
      <FormWrapper title="Reset Your Password">
        {resetLinkSent ? (
          <div className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <Mail className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Check your inbox</AlertTitle>
              <AlertDescription className="text-green-700">
                We've sent a password reset link to <strong>{email}</strong>. Please check your email inbox and spam folder.
              </AlertDescription>
            </Alert>
            <Button 
              type="button" 
              className="w-full"
              variant="outline"
              onClick={() => {
                setForgotPasswordMode(false);
                setResetLinkSent(false);
              }}
            >
              Return to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <FormInput 
              id="email" 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value.trim())} 
              required 
              disabled={isLoading} 
              placeholder="Enter your account email"
            />
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setForgotPasswordMode(false)}
                disabled={isLoading}
              >
                Back to Sign In
              </Button>
            </div>
          </form>
        )}
      </FormWrapper>
    );
  }

  return (
    <FormWrapper title="Welcome Back">
      <form onSubmit={handleSignIn} className="space-y-6">
        <FormInput 
          id="email" 
          label="Email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value.trim())} 
          required 
          disabled={isLoading} 
        />
        <div className="space-y-2">
          <FormInput 
            id="password" 
            label="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            disabled={isLoading} 
          />
          <button 
            onClick={(e) => {
              e.preventDefault();
              setForgotPasswordMode(true);
            }} 
            disabled={isLoading} 
            type="button" 
            className="text-sm transition-colors duration-200 text-zinc-950 self-start hover:text-gray-600"
          >
            Forgot password?
          </button>
        </div>
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
      </form>
      
      <ToggleFormLink 
        text="Don't have an account?" 
        linkText="Sign Up" 
        onClick={onToggleForm} 
      />
    </FormWrapper>
  );
};
