
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormInput } from "./FormInput";
import { FormHeader } from "./FormHeader";
import { FormFooter } from "./FormFooter";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { validateSignInForm } from "@/utils/authValidation";

interface SignInFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignInForm = ({ onToggleForm, isLoading, setIsLoading }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // Default to true for better UX
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address to reset your password");
      return;
    }

    setIsResettingPassword(true);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email - we've sent you a password reset link");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setIsResettingPassword(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    const validationError = validateSignInForm(email, password, isResettingPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe // Use rememberMe value to determine session persistence
        }
      });
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error("Please check your email to verify your account before signing in.");
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password. Please check your credentials and try again.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.session) {
        // Ensure session is properly set before navigating
        await supabase.auth.getSession();
        navigate("/");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormHeader title="Welcome Back" />
      <form onSubmit={handleSignIn} className="space-y-6">
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
          disabled={isLoading}
        />
        <div className="space-y-2">
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            onClick={handleForgotPassword}
            className="text-sm text-white hover:text-gray-200 transition-colors duration-200"
            disabled={isLoading}
            type="button"
          >
            Forgot password?
          </button>
        </div>
        <RememberMeCheckbox 
          checked={rememberMe}
          onCheckedChange={setRememberMe}
        />
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
      </form>
      <FormFooter
        message="Don't have an account?"
        actionText="Sign Up"
        onAction={onToggleForm}
      />
    </>
  );
};
