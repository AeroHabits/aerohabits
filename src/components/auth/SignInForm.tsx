
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FormInput } from "./FormInput";

interface SignInFormProps {
  onToggleForm: () => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const SignInForm = ({ onToggleForm, isLoading, setIsLoading }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign in failed",
            description: "The email or password you entered is incorrect. Please try again.",
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
      navigate("/");
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
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#0EA5E9] bg-clip-text text-transparent">
        Welcome Back
      </h1>
      <form onSubmit={handleSignIn} className="space-y-4">
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
      </form>
      <p className="text-center text-sm">
        Don't have an account?{" "}
        <button
          onClick={onToggleForm}
          className="text-blue-600 hover:underline"
          type="button"
        >
          Sign Up
        </button>
      </p>
    </>
  );
};
