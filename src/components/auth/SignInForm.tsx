import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

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
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [passwordResetStatus, setPasswordResetStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });
  
  const {
    navigate,
    handleError,
    handleSuccess
  } = useAuthForm();

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address to reset your password");
      return;
    }
    setIsLoading(true);
    setPasswordResetStatus({ type: null, message: null });
    
    try {
      // Log the reset request for debugging
      console.log("Sending password reset to:", email);
      
      const {
        data,
        error
      } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });
      
      console.log("Reset password response:", { data, error });
      
      if (error) throw error;
      
      setResetLinkSent(true);
      setPasswordResetStatus({
        type: "success",
        message: "We've sent a password reset link to your email. Please check your inbox and spam folder."
      });
      toast.success("Password reset link sent! Please check your email inbox and spam folder");
    } catch (error: any) {
      console.error("Password reset error:", error);
      setPasswordResetStatus({
        type: "error", 
        message: error?.message || "Failed to send reset link. Please try again later."
      });
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
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleForgotPassword} 
              disabled={isLoading} 
              type="button" 
              className="text-sm transition-colors duration-200 text-zinc-950 self-start hover:text-gray-600"
            >
              Forgot password?
            </button>
            
            {passwordResetStatus.type && (
              <Alert variant={passwordResetStatus.type === "error" ? "destructive" : "default"} className="mt-2">
                <AlertTitle>{passwordResetStatus.type === "success" ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{passwordResetStatus.message}</AlertDescription>
              </Alert>
            )}
          </div>
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
