import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormInput } from "./FormInput";

interface SignUpFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignUpForm = ({ onToggleForm, isLoading, setIsLoading }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast({
            title: "Please wait",
            description: "For security purposes, please wait 45 seconds before trying again.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email signups are disabled')) {
          toast({
            title: "Sign up disabled",
            description: "Email signups are currently disabled. Please contact the administrator.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }
      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[#4F46E5] via-[#818CF8] to-[#6366F1] bg-clip-text text-transparent mb-8 animate-gradient-x">
        Create Account
      </h1>
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
          className="w-full bg-gradient-to-r from-[#4F46E5] to-[#6366F1] hover:opacity-90 transition-opacity" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </form>
      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <button
          onClick={onToggleForm}
          className="text-[#6366F1] hover:text-[#4F46E5] transition-colors duration-200"
          type="button"
        >
          Sign In
        </button>
      </p>
    </>
  );
};
