
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";

interface SignInFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignInForm = ({ onToggleForm, isLoading, setIsLoading }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { navigate, handleError, handleSuccess } = useAuthForm();

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      handleError({ message: "Please enter your email address to reset your password" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;
      handleSuccess("We've sent you a password reset link");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!email || !password) {
      handleError({ message: "Please fill in all fields" });
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (data.session) {
        navigate("/");
      }
    } catch (error: any) {
      handleError(error);
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
        <div className="flex items-center space-x-3 bg-[#1A1F2C] hover:bg-[#222736] transition-colors p-4 rounded-lg border border-[#403E43]">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="h-5 w-5 data-[state=checked]:bg-[#9b87f5] border-2 border-[#8E9196] rounded-sm"
          />
          <label
            htmlFor="rememberMe"
            className="text-base font-medium text-[#C8C8C9] cursor-pointer select-none"
          >
            Remember me
          </label>
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
