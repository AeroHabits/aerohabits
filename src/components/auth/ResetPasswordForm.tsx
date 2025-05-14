
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FormInput } from "./FormInput";
import { FormWrapper } from "./FormWrapper";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { CheckCircle, AlertCircle } from "lucide-react";

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
  
  const { navigate } = useAuthForm();

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      setResetStatus({
        type: "error",
        message: "Please fill in all fields"
      });
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setResetStatus({
        type: "error",
        message: "Passwords do not match"
      });
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setResetStatus({
        type: "success",
        message: "Your password has been reset successfully. You will be redirected to login."
      });
      toast.success("Your password has been reset successfully");
      
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
      toast.error(error?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Reset Your Password">
      {resetStatus.type && (
        <Alert variant={resetStatus.type === "error" ? "destructive" : "default"} className={`mb-4 ${resetStatus.type === "success" ? "bg-green-50 border-green-200" : ""}`}>
          {resetStatus.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
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
          disabled={isLoading || resetStatus.type === "success"}
          placeholder="Enter your new password"
        />
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading || resetStatus.type === "success"}
          placeholder="Confirm your new password"
        />
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-gray-800 text-white transition-colors" 
          disabled={isLoading || resetStatus.type === "success"}
        >
          {isLoading ? "Processing..." : "Reset Password"}
        </Button>
      </form>
    </FormWrapper>
  );
};
