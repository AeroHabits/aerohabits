
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ResetPasswordFormProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const ResetPasswordForm = ({ isLoading, setIsLoading }: ResetPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetStatus, setResetStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });
  
  const { navigate, handleError, handleSuccess } = useAuthForm();

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) {
      handleError({ message: "Please fill in all fields" });
      setResetStatus({
        type: "error",
        message: "Please fill in all fields"
      });
      return false;
    }
    if (newPassword !== confirmPassword) {
      handleError({ message: "Passwords do not match" });
      setResetStatus({
        type: "error",
        message: "Passwords do not match"
      });
      return false;
    }
    if (newPassword.length < 6) {
      handleError({ message: "Password must be at least 6 characters long" });
      setResetStatus({
        type: "error",
        message: "Password must be at least 6 characters long"
      });
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setResetStatus({ type: null, message: null });
    
    if (!validatePasswords()) return;
    
    setIsLoading(true);

    try {
      console.log("Attempting to reset password");
      
      const { error, data } = await supabase.auth.updateUser({
        password: newPassword
      });

      console.log("Password reset response:", { data, error });

      if (error) throw error;

      setResetStatus({
        type: "success",
        message: "Your password has been reset successfully. You will be redirected to login."
      });
      handleSuccess("Your password has been reset successfully");
      
      // Provide some time for the user to see the success message before redirecting
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      setResetStatus({
        type: "error",
        message: error?.message || "Failed to reset password. Please try again."
      });
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Reset Password">
      {resetStatus.type && (
        <Alert variant={resetStatus.type === "error" ? "destructive" : "default"} className="mb-4">
          <AlertTitle>{resetStatus.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{resetStatus.message}</AlertDescription>
        </Alert>
      )}
      
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
          {isLoading ? "Processing..." : "Reset Password"}
        </Button>
      </form>
    </FormWrapper>
  );
};
