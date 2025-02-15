
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { useAuthForm } from "@/hooks/useAuthForm";

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const ResetPasswordForm = ({ isLoading, setIsLoading }: ResetPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { navigate, handleError, handleSuccess } = useAuthForm();

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) {
      handleError({ message: "Please fill in all fields" });
      return false;
    }
    if (newPassword !== confirmPassword) {
      handleError({ message: "Passwords do not match" });
      return false;
    }
    if (newPassword.length < 6) {
      handleError({ message: "Password must be at least 6 characters long" });
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!validatePasswords()) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      handleSuccess("Your password has been reset successfully");
      navigate("/auth");
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Reset Password">
      <form onSubmit={handleResetPassword} className="space-y-6">
        <FormInput
          id="newPassword"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Reset Password"}
        </Button>
      </form>
    </FormWrapper>
  );
};
