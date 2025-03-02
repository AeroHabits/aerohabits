
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNavigate } from "react-router-dom";

interface SignUpFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignUpForm = ({ onToggleForm, isLoading, setIsLoading }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const { handleError, handleSuccess } = useAuthForm();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Direct users to onboarding questionnaire instead of premium page
        navigate('/onboarding');
        handleSuccess("Account created successfully! Please complete the questionnaire to begin your free trial.");
      } else {
        handleSuccess("Please check your email to verify your account.");
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Create Account">
      <form onSubmit={handleSignUp} className="space-y-6">
        <FormInput
          id="fullName"
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={isLoading}
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </form>
      
      <ToggleFormLink
        text="Already have an account?"
        linkText="Sign In"
        onClick={onToggleForm}
      />
    </FormWrapper>
  );
}
