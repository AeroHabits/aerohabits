import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { ToggleFormLink } from "./ToggleFormLink";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNavigate } from "react-router-dom";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
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
  const [formError, setFormError] = useState<string | null>(null);
  
  const { handleError } = useAuthForm();
  const navigate = useNavigate();

  // Validate form input
  const validateForm = () => {
    setFormError(null);
    
    if (!fullName.trim()) {
      setFormError("Please enter your name");
      return false;
    }
    
    if (!email.trim()) {
      setFormError("Please enter your email");
      return false;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setFormError("Please enter a valid email address");
      return false;
    }
    
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return false;
    }
    
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    // Validate form
    if (!validateForm()) return;
    
    setIsLoading(true);
    setFormError(null);

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
        // Create a toast notification
        toast.success("Account created successfully!");
        
        // Redirect to the onboarding questionnaire
        navigate('/onboarding');
      } else {
        toast.success("Please check your email to verify your account.");
      }
    } catch (error: any) {
      // Set form error for display
      setFormError(error.message || "Failed to create account");
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Create Account">
      <form onSubmit={handleSignUp} className="space-y-6">
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{formError}</span>
          </div>
        )}
        
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
        <div>
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <PasswordStrengthMeter password={password} />
        </div>
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
