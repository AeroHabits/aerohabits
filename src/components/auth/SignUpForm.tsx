
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    console.log("Attempting sign up with:", { email, fullName });
    
    try {
      // Always set is_new_user to true for new signups
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            is_new_user: true,  // Mark the user as new
          },
        },
      });

      console.log("Sign up response:", { 
        user: data.user ? "User created" : "No user", 
        error: error?.message || null 
      });
      
      if (error) throw error;

      if (data.user) {
        // User created, direct to onboarding questionnaire
        toast.success("Account created successfully!");
        
        // Wait for auth state to propagate
        setTimeout(() => {
          console.log("Redirecting to onboarding after signup");
          navigate('/onboarding');
        }, 500);
        
        handleSuccess("Please complete the questionnaire to begin your free trial.");
      } else {
        handleSuccess("Please check your email to verify your account.");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error?.message || "Failed to create account. Please try again.");
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
          onChange={(e) => setEmail(e.target.value.trim())}
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
