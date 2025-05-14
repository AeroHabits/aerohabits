
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthForm = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const navigate = useNavigate();

  const handleError = (error: any) => {
    const message = error?.message || "An unexpected error occurred. Please try again.";
    toast.error(message);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return {
    isLoading,
    setIsLoading,
    navigate,
    handleError,
    handleSuccess
  };
};
